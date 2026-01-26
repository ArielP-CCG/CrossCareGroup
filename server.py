import http.server
import socketserver
import urllib.parse
import urllib.request
import json
import os
import time
import re
import hashlib
from datetime import datetime

# --- CONFIGURATION ---
# Load .env file manually to avoid external dependencies
if os.path.exists(".env"):
    print("Loading .env file...")
    with open(".env", "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if "=" in line and not line.startswith("#"):
                try:
                    key, value = line.split("=", 1)
                    os.environ[key.strip()] = value.strip()
                except ValueError:
                    continue

PORT = int(os.environ.get("PORT", 8000))

# Power Automate / Logic App Config (Cleaned Env)
ENDPOINTS = {
    "submit-support": os.environ.get("DEV_API_REQUEST_SUPPORT"),
    "submit-contact": os.environ.get("DEV_API_REQUEST_ENQUIRY"),
    "submit-eoi": os.environ.get("DEV_API_REQUEST_EOI"),
    "make-a-referral": os.environ.get("DEV_API_REQUEST_REFERRAL"),
    "submit-feedback": os.environ.get("DEV_API_REQUEST_FAC"),
    "submit-complaint": os.environ.get("DEV_API_REQUEST_FAC")
}

# --- SECURITY CONFIGURATION ---
# Allowed file extensions for uploads
ALLOWED_FILE_EXTENSIONS = {'.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.txt'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
MAX_FILES_PER_REQUEST = 5

# Rate limiting configuration
RATE_LIMIT_WINDOW = 60  # seconds
RATE_LIMIT_MAX_REQUESTS = 5  # requests per window (stricter than before)
RATE_LIMIT_BAN_THRESHOLD = 3  # number of violations before temporary ban
RATE_LIMIT_BAN_DURATION = 300  # 5 minutes ban

# --- RATE LIMITING & IP BLOCKING ---
rate_limit_store = {}  # {ip: [timestamps]}
ip_violations = {}  # {ip: violation_count}
ip_blacklist = {}  # {ip: ban_expiry_timestamp}

def is_ip_banned(ip):
    """Check if IP is currently banned"""
    if ip in ip_blacklist:
        if time.time() < ip_blacklist[ip]:
            return True
        else:
            # Ban expired, remove from blacklist
            del ip_blacklist[ip]
            if ip in ip_violations:
                ip_violations[ip] = 0
    return False

def is_rate_limited(ip):
    """Enhanced rate limiting with progressive penalties"""
    now = time.time()
    
    # Check if IP is banned
    if is_ip_banned(ip):
        return True
    
    if ip not in rate_limit_store:
        rate_limit_store[ip] = []
    
    # Clean up old timestamps (older than rate limit window)
    rate_limit_store[ip] = [t for t in rate_limit_store[ip] if now - t < RATE_LIMIT_WINDOW]
    
    # Check if limit exceeded
    if len(rate_limit_store[ip]) >= RATE_LIMIT_MAX_REQUESTS:
        # Increment violation count
        ip_violations[ip] = ip_violations.get(ip, 0) + 1
        
        # Ban IP if violations exceed threshold
        if ip_violations[ip] >= RATE_LIMIT_BAN_THRESHOLD:
            ip_blacklist[ip] = now + RATE_LIMIT_BAN_DURATION
            log_event(f"SECURITY: IP {ip} BANNED for {RATE_LIMIT_BAN_DURATION}s due to repeated violations")
        
        return True
    
    rate_limit_store[ip].append(now)
    return False

# --- INPUT VALIDATION & SANITIZATION ---
def sanitize_input(value, field_type="text", max_length=1000):
    """Sanitize and validate input based on field type"""
    if value is None:
        return ""
    
    value = str(value).strip()
    
    # Length check
    if len(value) > max_length:
        value = value[:max_length]
    
    # Type-specific validation
    if field_type == "email":
        # Basic email validation
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, value):
            raise ValueError(f"Invalid email format: {value}")
    
    elif field_type == "phone":
        # Remove non-numeric characters except + and spaces
        value = re.sub(r'[^\d\s\+\-\(\)]', '', value)
    
    elif field_type == "text":
        # Remove potentially dangerous characters
        value = re.sub(r'[<>{}]', '', value)
    
    return value

def validate_file_upload(filename, content_base64):
    """Validate file uploads for security"""
    # Check file extension
    ext = os.path.splitext(filename.lower())[1]
    if ext not in ALLOWED_FILE_EXTENSIONS:
        raise ValueError(f"File type not allowed: {ext}. Allowed types: {', '.join(ALLOWED_FILE_EXTENSIONS)}")
    
    # Check file size (base64 encoded size)
    import base64
    try:
        file_data = base64.b64decode(content_base64)
        if len(file_data) > MAX_FILE_SIZE:
            raise ValueError(f"File too large: {len(file_data)} bytes. Max: {MAX_FILE_SIZE} bytes")
    except Exception as e:
        raise ValueError(f"Invalid file data: {e}")
    
    return True

# --- LOGGING UTILITY WITH PII PROTECTION ---
def mask_pii(text):
    """Mask personally identifiable information in logs"""
    if not isinstance(text, str):
        text = str(text)
    
    # Mask email addresses
    text = re.sub(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', '[EMAIL_REDACTED]', text)
    
    # Mask phone numbers (various formats)
    text = re.sub(r'\b\d{10,}\b', '[PHONE_REDACTED]', text)
    text = re.sub(r'\(\d{3}\)\s*\d{3}[-.\s]?\d{4}', '[PHONE_REDACTED]', text)
    
    # Mask potential names in common fields
    text = re.sub(r'"(name|fullName|clientFullName|firstName|lastName)"\s*:\s*"[^"]*"', 
                  r'"\1": "[NAME_REDACTED]"', text, flags=re.IGNORECASE)
    
    return text

def log_event(message, include_pii=False):
    """Logs a message to a daily file in the /logs directory with PII protection"""
    try:
        if not os.path.exists("logs"):
            os.makedirs("logs")
        
        now = datetime.now()
        date_str = now.strftime("%Y%m%d")
        timestamp = now.strftime("%Y-%m-%d %H:%M:%S")
        filename = f"logs/CCG-{date_str}.log"
        
        # Mask PII unless explicitly allowed
        safe_message = message if include_pii else mask_pii(message)
        
        log_entry = f"[{timestamp}] {safe_message}\n"
        print(safe_message)  # Console output also masked
        
        with open(filename, "a", encoding="utf-8") as f:
            f.write(log_entry)
    except Exception as e:
        print(f"FAILED TO LOG: {e}")

def serve_error_page(handler, code):
    """Serves a custom HTML error page if it exists, otherwise sends a plain error."""
    handler.send_response(code)
    handler.send_header('Content-type', 'text/html; charset=utf-8')
    handler.send_header('X-Content-Type-Options', 'nosniff')
    handler.send_header('X-Frame-Options', 'DENY')
    handler.end_headers()
    
    file_path = os.path.join("", f"{code}.html")
    if os.path.exists(file_path):
        with open(file_path, "rb") as f:
            handler.wfile.write(f.read())
    else:
        # Fallback to plain text if HTML doesn't exist
        messages = {
            400: b"400 Bad Request",
            403: b"403 Forbidden",
            404: b"404 Not Found",
            413: b"413 Payload Too Large",
            429: b"429 Too Many Requests",
            500: b"500 Internal Server Error",
            502: b"502 Bad Gateway",
            503: b"503 Service Unavailable"
        }
        handler.wfile.write(messages.get(code, b"Error"))

class CCGHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enhanced Production Security Headers
        # CORS - restrict in production to specific domains
        allowed_origin = os.environ.get("ALLOWED_ORIGIN", "*")
        self.send_header('Access-Control-Allow-Origin', allowed_origin)
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Access-Control-Max-Age', '86400')
        
        # Security Headers
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'DENY')
        self.send_header('X-XSS-Protection', '1; mode=block')
        
        # Strict Transport Security (HSTS) - enforce HTTPS in production
        # Uncomment when deploying with HTTPS
        # self.send_header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
        
        # Content Security Policy - Enhanced
        csp = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://www.googletagmanager.com; "
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
            "font-src 'self' https://fonts.gstatic.com; "
            "img-src 'self' data: https://*; "
            "frame-src 'self' https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com; "
            "connect-src 'self' https://*; "
            "object-src 'none'; "
            "base-uri 'self'; "
            "form-action 'self'; "
            "frame-ancestors 'none'; "
            "upgrade-insecure-requests;"
        )
        self.send_header('Content-Security-Policy', csp)
        
        # Referrer Policy
        self.send_header('Referrer-Policy', 'strict-origin-when-cross-origin')
        
        # Permissions Policy (formerly Feature Policy)
        self.send_header('Permissions-Policy', 
                        'geolocation=(), microphone=(), camera=(), payment=()')
        
        http.server.SimpleHTTPRequestHandler.end_headers(self)

    def do_POST(self):
        # 1. Rate Limiting Check
        client_ip = self.client_address[0]
        if is_rate_limited(client_ip):
            log_event(f"SECURITY: Rate limit exceeded for {client_ip}")
            self.send_response(429)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "error", "message": "Too many requests. Please wait a minute."}).encode())
            return

        log_event(f"API: Incoming submission to {self.path} from {client_ip}")
        
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length > 10 * 1024 * 1024: # Limit payload to 10MB (for attachments)
                log_event(f"SECURITY: Payload too large ({content_length} bytes) from {client_ip}")
                self.send_response(413)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": "Payload too large"}).encode())
                return

            post_data = self.rfile.read(content_length).decode('utf-8')
            payload = json.loads(post_data)
            log_event(f"PAYLOAD: {json.dumps(payload)}")
        except json.JSONDecodeError as e:
            log_event(f"SECURITY: Invalid JSON from {client_ip}: {e}")
            serve_error_page(self, 400)
            return
        except Exception as e:
            log_event(f"ERROR: Failed to read/parse POST data: {e}")
            serve_error_page(self, 400)
            return

        # 2. Determine Endpoint
        url_path = urllib.parse.urlparse(self.path).path
        form_type = url_path.strip('/').split('/')[-1]
        
        target_url = ENDPOINTS.get(form_type)
        
        if not target_url:
            log_event(f"SECURITY: Unauthorized/Unknown endpoint requested: {form_type} from {client_ip}")
            self.send_response(404)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "error", "message": "Endpoint not found"}).encode())
            return

        # 3. Validate and Sanitize Input
        try:
            # Flatten payload for Power Automate (remove 'fields' wrapper if present)
            if 'fields' in payload:
                fields = payload['fields']
                attachments = payload.get('attachments', [])
            else:
                fields = payload
                attachments = []

            # Validate attachments if present
            if attachments:
                if len(attachments) > MAX_FILES_PER_REQUEST:
                    raise ValueError(f"Too many files. Maximum {MAX_FILES_PER_REQUEST} allowed.")
                
                for idx, attachment in enumerate(attachments):
                    filename = attachment.get('name', '')
                    content = attachment.get('content', '')
                    
                    if not filename or not content:
                        raise ValueError(f"Invalid attachment at index {idx}")
                    
                    # Validate file
                    validate_file_upload(filename, content)
                    log_event(f"SECURITY: File validated: {filename} ({len(content)} bytes base64)")

            # Sanitize text fields (basic sanitization, adjust field names as needed)
            # This is a general approach - you may want to customize per form type
            sanitized_fields = {}
            for key, value in fields.items():
                if isinstance(value, str):
                    # Apply basic sanitization
                    sanitized_fields[key] = sanitize_input(value, "text", max_length=5000)
                else:
                    sanitized_fields[key] = value
            
            # Rebuild final payload
            final_payload = sanitized_fields
            if attachments:
                final_payload['attachments'] = attachments

            # Inject caf_type for feedback consolidation
            if form_type == "submit-feedback": 
                final_payload['caf_type'] = "Feedback"
            if form_type == "submit-complaint": 
                final_payload['caf_type'] = "Complaint"

        except ValueError as e:
            log_event(f"SECURITY: Validation failed from {client_ip}: {e}")
            self.send_response(400)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode())
            return
        except Exception as e:
            log_event(f"ERROR: Input validation error: {e}")
            serve_error_page(self, 400)
            return

        # 4. Proxy to Power Automate
        log_event(f"PROXY: Forwarding {form_type} to Power Automate...")
        
        try:
            req = urllib.request.Request(
                target_url,
                data=json.dumps(final_payload).encode('utf-8'),
                headers={'Content-Type': 'application/json'},
                method='POST'
            )
            
            with urllib.request.urlopen(req, timeout=30) as response:
                log_event(f"SUCCESS: {form_type} processed by remote endpoint.")
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success"}).encode())
                return
        except urllib.error.HTTPError as e:
            log_event(f"REMOTE ERROR: {e.code} - {e.read().decode()}")
            serve_error_page(self, 502)
        except urllib.error.URLError as e:
            log_event(f"NETWORK ERROR: {e}")
            serve_error_page(self, 503)
        except Exception as e:
            log_event(f"PROXY ERROR: {e}")
            serve_error_page(self, 500)

    def do_GET(self):
        # 1. Block access to sensitive files
        forbidden_patterns = [".env", ".git", ".py", "logs/", ".bak", "config"]
        path = self.path.split('?')[0].lower() # ignore query params and be case insensitive
        
        if any(pattern in path for pattern in forbidden_patterns):
            log_event(f"SECURITY: BLOCKED access to {path} from {self.client_address[0]}")
            serve_error_page(self, 403)
            return

        # 2. Prevent directory listing (not strictly necessary with SimpleHTTPRequestHandler but good practice)
        if path.endswith('/') and not os.path.exists(os.path.join(os.getcwd(), path.strip('/'), 'index.html')):
             self.send_response(403)
             self.end_headers()
             return

        return http.server.SimpleHTTPRequestHandler.do_GET(self)

    def send_error(self, code, message=None, explain=None):
        if code == 404:
            serve_error_page(self, 404)
        else:
            super().send_error(code, message, explain)

if __name__ == "__main__":
    log_event(f"CCG Clinical Backend starting at http://localhost:{PORT}")
    
    # Allow address reuse (solves most "port already in use" errors during dev)
    socketserver.TCPServer.allow_reuse_address = True
    
    try:
        with socketserver.TCPServer(("", PORT), CCGHandler) as httpd:
            # Increase connection backlog and timeout for production stability
            httpd.timeout = 30
            httpd.serve_forever()
    except OSError as e:
        if e.errno == 10048:
            log_event(f"CRITICAL ERROR: Port {PORT} is already in use.")
            log_event("TIP: Run 'stop-server' or kill the existing Python process.")
        raise

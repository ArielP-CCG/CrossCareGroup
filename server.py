import http.server
import socketserver
import urllib.parse
import urllib.request
import json
import os
import time
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

# --- RATE LIMITING ---
rate_limit_store = {} # {ip: [timestamps]}

def is_rate_limited(ip):
    now = time.time()
    if ip not in rate_limit_store:
        rate_limit_store[ip] = []
    
    # Clean up old timestamps (older than 60s)
    rate_limit_store[ip] = [t for t in rate_limit_store[ip] if now - t < 60]
    
    if len(rate_limit_store[ip]) >= 10: # Increased to 10 requests per minute for flexibility
        return True
    
    rate_limit_store[ip].append(now)
    return False

# --- LOGGING UTILITY ---
def log_event(message):
    """Logs a message to a daily file in the /logs directory."""
    try:
        if not os.path.exists("logs"):
            os.makedirs("logs")
        
        now = datetime.now()
        date_str = now.strftime("%Y%m%d")
        timestamp = now.strftime("%Y-%m-%d %H:%M:%S")
        filename = f"logs/CCG-{date_str}.log"
        
        log_entry = f"[{timestamp}] {message}\n"
        print(message)
        
        with open(filename, "a", encoding="utf-8") as f:
            f.write(log_entry)
    except Exception as e:
        print(f"FAILED TO LOG: {e}")

def serve_error_page(handler, code):
    """Serves a custom HTML error page if it exists, otherwise sends a plain error."""
    handler.send_response(code)
    handler.send_header('Content-type', 'text/html')
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
            500: b"500 Internal Server Error",
            502: b"502 Bad Gateway",
            503: b"503 Service Unavailable"
        }
        handler.wfile.write(messages.get(code, b"Error"))

class CCGHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Production Security Headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('X-Frame-Options', 'DENY')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('Content-Security-Policy', "default-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com https://cdn.tailwindcss.com; img-src 'self' data:;")
        self.send_header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
        self.send_header('Referrer-Policy', 'strict-origin-when-cross-origin')
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

        log_event(f"API: Incoming submission to {self.path}")
        
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length > 10 * 1024 * 1024: # Limit payload to 10MB (for attachments)
                self.send_response(413)
                self.end_headers()
                return

            post_data = self.rfile.read(content_length).decode('utf-8')
            payload = json.loads(post_data)
            log_event(f"PAYLOAD: {json.dumps(payload)}")
        except Exception as e:
            log_event(f"ERROR: Failed to read/parse POST data: {e}")
            serve_error_page(self, 400)
            return

        # 2. Determine Endpoint
        url_path = urllib.parse.urlparse(self.path).path
        form_type = url_path.strip('/').split('/')[-1]
        
        target_url = ENDPOINTS.get(form_type)
        
        if not target_url:
            log_event(f"SECURITY: Unauthorized/Unknown endpoint requested: {form_type}")
            self.send_response(404)
            self.end_headers()
            return

        # 3. Proxy to Power Automate
        log_event(f"PROXY: Forwarding {form_type} to Power Automate...")
        
        try:
            # Flatten payload for Power Automate (remove 'fields' wrapper if present)
            if 'fields' in payload:
                # Merge attachments back into the main payload if they were separate
                final_payload = {**payload['fields']}
                if 'attachments' in payload:
                    final_payload['attachments'] = payload['attachments']
            else:
                final_payload = payload

            # Inject caf_type for feedback consolidation
            if form_type == "submit-feedback": final_payload['caf_type'] = "Feedback"
            if form_type == "submit-complaint": final_payload['caf_type'] = "Complaint"

            req = urllib.request.Request(
                target_url,
                data=json.dumps(final_payload).encode('utf-8'),
                headers={'Content-Type': 'application/json'},
                method='POST'
            )
            
            with urllib.request.urlopen(req) as response:
                log_event(f"SUCCESS: {form_type} processed by remote endpoint.")
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success"}).encode())
                return
        except urllib.error.HTTPError as e:
            log_event(f"REMOTE ERROR: {e.code} - {e.read().decode()}")
            serve_error_page(self, 502) # serve_error_page handles common codes, others might default
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

# 🔒 Cross Care Group - Security Implementation Guide

## Overview
This document outlines the comprehensive security measures implemented across the Cross Care Group web application, covering both frontend and backend security.

---

## 🛡️ Backend Security (server.py)

### 1. **Rate Limiting & IP Protection**

#### Configuration
- **Rate Limit**: 5 requests per minute per IP address
- **Violation Threshold**: 3 violations before temporary ban
- **Ban Duration**: 5 minutes (300 seconds)

#### Features
- ✅ Adaptive rate limiting with progressive penalties
- ✅ Automatic IP blacklisting for repeated violations
- ✅ Automatic ban expiration and cleanup
- ✅ Per-IP request tracking with sliding window

#### How It Works
```python
# Rate limiting is checked on every POST request
if is_rate_limited(client_ip):
    return 429 Too Many Requests
```

### 2. **Input Validation & Sanitization**

#### Text Input Validation
- Maximum field length: 5000 characters
- Removal of dangerous characters: `< > { }`
- Email format validation with regex
- Phone number sanitization

#### File Upload Security
- **Allowed Extensions**: `.pdf`, `.doc`, `.docx`, `.jpg`, `.jpeg`, `.png`, `.txt`
- **Maximum File Size**: 10MB per file
- **Maximum Files**: 5 files per request
- **Validation**: File type and size checked on both frontend and backend
- **Base64 Decoding**: Validates file content integrity

### 3. **Security Headers**

#### Implemented Headers
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: [Strict policy]
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=()
```

#### CORS Configuration
- Configurable via `ALLOWED_ORIGIN` environment variable
- Default: `*` (development)
- Production: Set to specific domain (e.g., `https://crosscaregroup.com.au`)

#### HSTS (Production)
```python
# Uncomment in production with HTTPS
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### 4. **PII Protection in Logs**

#### Automatic Masking
All logs automatically mask:
- ✅ Email addresses → `[EMAIL_REDACTED]`
- ✅ Phone numbers → `[PHONE_REDACTED]`
- ✅ Names in common fields → `[NAME_REDACTED]`

#### Usage
```python
log_event("User submitted form", include_pii=False)  # Default: PII masked
log_event("Debug info", include_pii=True)  # Explicit: Keep PII
```

### 5. **Request Security**

#### Payload Size Limits
- Maximum payload: 10MB (includes attachments)
- Returns `413 Payload Too Large` if exceeded

#### Timeout Protection
- Remote API timeout: 30 seconds
- Prevents hanging connections

#### Error Handling
- Custom error pages for: 400, 403, 404, 413, 429, 500, 502, 503
- Detailed logging without exposing sensitive information
- User-friendly error messages

### 6. **File Access Protection**

#### Blocked Patterns
Access to these files/directories is automatically blocked:
- `.env` files
- `.git` directory
- `.py` Python files
- `logs/` directory
- `.bak` backup files
- `config` files

#### Directory Listing Prevention
- Prevents browsing of directories without `index.html`
- Returns `403 Forbidden`

---

## 🌐 Frontend Security (forms.js)

### 1. **Client-Side Rate Limiting**

#### Configuration
- **Rate Limit**: 5 submissions per minute
- **Window**: 60 seconds (60,000ms)
- **Storage**: In-memory (per session)

#### Features
- ✅ Prevents spam submissions
- ✅ Automatic cleanup of old timestamps
- ✅ Rollback on failed submissions

### 2. **XSS Prevention**

#### Enhanced Sanitization
```javascript
function sanitize(str) {
  // 1. Trim and limit length (5000 chars)
  // 2. HTML encode via textContent
  // 3. Remove dangerous patterns:
  //    - javascript: protocol
  //    - Event handlers (onclick, onerror, etc.)
  //    - <script> tags
  //    - <iframe> tags
}
```

### 3. **File Upload Validation**

#### Client-Side Checks
- **File Size**: Maximum 10MB per file
- **File Count**: Maximum 5 files per submission
- **File Types**: Same as backend (`.pdf`, `.doc`, `.docx`, `.jpg`, `.jpeg`, `.png`, `.txt`)
- **Double Extension Detection**: Prevents `file.pdf.exe` attacks
- **Filename Sanitization**: Removes special characters

#### Validation Flow
```javascript
1. Check file count
2. Validate each file (type + size)
3. Sanitize filename
4. Process file (Base64 encoding)
5. Handle errors gracefully
```

### 4. **CSRF Protection**

#### Token Generation
- Uses `crypto.getRandomValues()` for secure random tokens
- 256-bit (32-byte) tokens
- Stored in `sessionStorage`
- Sent with every request via `X-CSRF-Token` header

#### Implementation
```javascript
const csrfToken = getCSRFToken();
fetch(endpoint, {
  headers: {
    'X-CSRF-Token': csrfToken
  }
});
```

### 5. **Secure Communication**

#### Fetch Configuration
```javascript
fetch(endpoint, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken
  },
  credentials: 'same-origin',  // Include cookies
  body: JSON.stringify(payload)
});
```

### 6. **Error Handling**

#### User-Friendly Messages
- Generic errors: "An unexpected error occurred"
- Rate limiting: "Too many submissions. Please wait a minute"
- File errors: Specific messages about size/type
- Server errors: "Our team has been notified"

#### Error Logging
- All errors logged to console for debugging
- User sees sanitized, helpful messages
- No sensitive information exposed

---

## 📊 Security Configuration Summary

### Backend (`server.py`)
| Feature | Configuration | Adjustable |
|---------|--------------|------------|
| Rate Limit | 5 req/min | ✅ `RATE_LIMIT_MAX_REQUESTS` |
| Ban Duration | 5 minutes | ✅ `RATE_LIMIT_BAN_DURATION` |
| Max File Size | 10MB | ✅ `MAX_FILE_SIZE` |
| Max Files | 5 files | ✅ `MAX_FILES_PER_REQUEST` |
| Max Payload | 10MB | ✅ Line 270 |
| API Timeout | 30 seconds | ✅ Line 377 |

### Frontend (`forms.js`)
| Feature | Configuration | Adjustable |
|---------|--------------|------------|
| Rate Limit | 5 req/min | ✅ `SECURITY_CONFIG.rateLimitMax` |
| Max File Size | 10MB | ✅ `SECURITY_CONFIG.maxFileSize` |
| Max Files | 5 files | ✅ `SECURITY_CONFIG.maxFiles` |
| Max Field Length | 5000 chars | ✅ `SECURITY_CONFIG.maxFieldLength` |

---

## 🚀 Production Deployment Checklist

### Environment Variables
- [ ] Set `ALLOWED_ORIGIN` to your production domain
- [ ] Update `ADMIN_PASSWORD` to a strong password
- [ ] Verify all API endpoints are configured

### Backend Configuration
- [ ] Uncomment HSTS header in `server.py` (line 220)
- [ ] Enable HTTPS/SSL certificate
- [ ] Review and adjust rate limits for production traffic
- [ ] Set up log rotation for `/logs` directory
- [ ] Configure firewall rules

### Frontend Configuration
- [ ] Review CSP policy for third-party scripts
- [ ] Test all forms with security measures enabled
- [ ] Verify file upload limits match backend
- [ ] Test rate limiting behavior

### Monitoring
- [ ] Set up log monitoring for security events
- [ ] Monitor rate limit violations
- [ ] Track IP bans and patterns
- [ ] Set up alerts for repeated 403/429 errors

---

## 🔍 Security Testing

### Manual Testing
1. **Rate Limiting**: Submit forms rapidly (>5 times/min)
2. **File Upload**: Try uploading `.exe`, `.sh`, oversized files
3. **XSS**: Try injecting `<script>alert('XSS')</script>` in text fields
4. **Path Traversal**: Try accessing `/.env`, `/logs/`, `/.git`
5. **CSRF**: Submit forms without valid token

### Automated Testing
```bash
# Test rate limiting
for i in {1..10}; do curl -X POST http://localhost:8000/api/submit-contact; done

# Test file access blocking
curl http://localhost:8000/.env
curl http://localhost:8000/server.py
curl http://localhost:8000/logs/

# Test payload size limit
curl -X POST -H "Content-Type: application/json" \
  -d @large_payload.json http://localhost:8000/api/submit-contact
```

---

## 📝 Logging & Monitoring

### Log Files
- Location: `/logs/CCG-YYYYMMDD.log`
- Format: `[YYYY-MM-DD HH:MM:SS] MESSAGE`
- PII: Automatically masked

### Security Events Logged
- ✅ Rate limit violations
- ✅ IP bans
- ✅ Blocked file access attempts
- ✅ Invalid endpoints
- ✅ Payload size violations
- ✅ File validation failures
- ✅ JSON parsing errors

### Example Log Entries
```
[2026-01-23 07:55:52] SECURITY: Rate limit exceeded for 192.168.1.100
[2026-01-23 07:56:00] SECURITY: IP 192.168.1.100 BANNED for 300s due to repeated violations
[2026-01-23 07:57:30] SECURITY: BLOCKED access to /.env from 192.168.1.101
[2026-01-23 07:58:15] SECURITY: File validated: document.pdf (45678 bytes base64)
```

---

## 🆘 Troubleshooting

### "Too many requests" Error
- **Cause**: Rate limit exceeded (>5 requests/min)
- **Solution**: Wait 60 seconds before retrying
- **Admin**: Check logs for IP, adjust `RATE_LIMIT_MAX_REQUESTS` if needed

### "File type not allowed" Error
- **Cause**: Unsupported file extension
- **Solution**: Convert file to allowed format
- **Admin**: Add extension to `ALLOWED_FILE_EXTENSIONS`

### "Payload too large" Error
- **Cause**: Total request size >10MB
- **Solution**: Reduce file sizes or number of files
- **Admin**: Increase `MAX_FILE_SIZE` if needed

### IP Banned
- **Cause**: 3+ rate limit violations
- **Duration**: 5 minutes
- **Admin**: Clear ban by restarting server or wait for expiration

---

## 📚 Additional Resources

### Security Best Practices
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [CORS Best Practices](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

### Python Security
- [Python Security Best Practices](https://python.readthedocs.io/en/stable/library/security_warnings.html)
- [Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)

### JavaScript Security
- [XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

---

## 📞 Support

For security concerns or questions:
- Review this documentation
- Check application logs in `/logs`
- Contact the development team

**Last Updated**: 2026-01-23
**Version**: 2.0 - Enterprise Security Implementation

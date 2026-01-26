# 🔒 Security Quick Reference

## ✅ Implemented Security Features

### Backend (server.py)
- [x] **Rate Limiting**: 5 requests/min per IP
- [x] **IP Blacklisting**: Auto-ban after 3 violations (5 min)
- [x] **Input Validation**: Text sanitization, length limits
- [x] **File Upload Security**: Type, size, count validation
- [x] **Security Headers**: CSP, X-Frame-Options, HSTS-ready, etc.
- [x] **PII Protection**: Auto-masking in logs
- [x] **Request Size Limits**: 10MB max payload
- [x] **Timeout Protection**: 30s API timeout
- [x] **File Access Blocking**: .env, .git, .py, logs, etc.
- [x] **Error Handling**: Custom error pages, safe messages
- [x] **CORS Configuration**: Environment-based origin control

### Frontend (forms.js)
- [x] **Client-Side Rate Limiting**: 5 submissions/min
- [x] **XSS Prevention**: Enhanced input sanitization
- [x] **File Validation**: Type, size, count, double-extension check
- [x] **CSRF Protection**: Crypto-based tokens
- [x] **Secure Communication**: Credentials, headers
- [x] **Error Handling**: User-friendly messages
- [x] **Input Length Limits**: 5000 chars per field
- [x] **Filename Sanitization**: Remove special characters

---

## 🎯 Rate Limiting Summary

| Layer | Limit | Window | Action on Exceed |
|-------|-------|--------|------------------|
| **Frontend** | 5 requests | 60 seconds | Error modal + rollback |
| **Backend** | 5 requests | 60 seconds | 429 response |
| **IP Ban** | 3 violations | 5 minutes | Temporary blacklist |

---

## 📁 File Upload Restrictions

| Property | Limit | Enforced |
|----------|-------|----------|
| **Max File Size** | 10MB | Frontend + Backend |
| **Max Files** | 5 files | Frontend + Backend |
| **Allowed Types** | .pdf, .doc, .docx, .jpg, .jpeg, .png, .txt | Frontend + Backend |
| **Filename** | Sanitized (alphanumeric + ._-) | Frontend |
| **Double Extensions** | Blocked | Frontend |

---

## 🛡️ Security Headers

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: [Strict]
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=()
Access-Control-Allow-Origin: [Configurable]
```

---

## 🚫 Blocked Access

The following paths return **403 Forbidden**:
- `/.env`
- `/.git/*`
- `/*.py`
- `/logs/*`
- `/*.bak`
- `/config`

---

## 📊 Error Codes

| Code | Meaning | Common Cause |
|------|---------|--------------|
| **400** | Bad Request | Invalid JSON, validation failure |
| **403** | Forbidden | Blocked file access |
| **404** | Not Found | Unknown endpoint |
| **413** | Payload Too Large | File/payload >10MB |
| **429** | Too Many Requests | Rate limit exceeded |
| **500** | Internal Server Error | Server-side error |
| **502** | Bad Gateway | Remote API error |
| **503** | Service Unavailable | Network error |

---

## 🔧 Configuration Files

### `.env`
```bash
PORT=8000
ALLOWED_ORIGIN=*  # Change to domain in production
```

### `server.py` (Lines to adjust)
```python
# Line 40-44: Security Configuration
ALLOWED_FILE_EXTENSIONS = {'.pdf', '.doc', '.docx', ...}
MAX_FILE_SIZE = 10 * 1024 * 1024
MAX_FILES_PER_REQUEST = 5

# Line 47-50: Rate Limiting
RATE_LIMIT_WINDOW = 60
RATE_LIMIT_MAX_REQUESTS = 5
RATE_LIMIT_BAN_THRESHOLD = 3
RATE_LIMIT_BAN_DURATION = 300
```

### `forms.js` (Lines 11-17)
```javascript
const SECURITY_CONFIG = {
  maxFileSize: 10 * 1024 * 1024,
  maxFiles: 5,
  allowedFileTypes: ['.pdf', '.doc', ...],
  maxFieldLength: 5000,
  rateLimitWindow: 60000,
  rateLimitMax: 5
};
```

---

## 🧪 Quick Tests

### Test Rate Limiting
```bash
# Should succeed 5 times, then fail
for i in {1..7}; do 
  curl -X POST http://localhost:8000/api/submit-contact \
    -H "Content-Type: application/json" \
    -d '{"fields":{"test":"data"}}'
  sleep 1
done
```

### Test File Access Blocking
```bash
# All should return 403
curl http://localhost:8000/.env
curl http://localhost:8000/server.py
curl http://localhost:8000/logs/
```

### Test XSS Prevention
```javascript
// In browser console on form page
document.querySelector('input[name="test"]').value = '<script>alert("XSS")</script>';
// Submit form - should be sanitized
```

---

## 📝 Log Monitoring

### Watch for Security Events
```bash
# Windows PowerShell
Get-Content logs\CCG-$(Get-Date -Format "yyyyMMdd").log -Wait | Select-String "SECURITY"
```

### Common Security Log Patterns
```
SECURITY: Rate limit exceeded for [IP]
SECURITY: IP [IP] BANNED for 300s
SECURITY: BLOCKED access to [path]
SECURITY: Validation failed from [IP]
SECURITY: File validated: [filename]
```

---

## 🚀 Production Checklist

- [ ] Set `ALLOWED_ORIGIN` to production domain
- [ ] Uncomment HSTS header (line 220 in server.py)
- [ ] Enable HTTPS/SSL
- [ ] Review rate limits for expected traffic
- [ ] Set up log rotation
- [ ] Configure monitoring/alerts
- [ ] Test all security features
- [ ] Update `ADMIN_PASSWORD`

---

## 📞 Emergency Response

### If Under Attack
1. Check logs: `logs/CCG-YYYYMMDD.log`
2. Identify attacking IPs
3. Restart server to clear IP bans (if needed)
4. Adjust rate limits if necessary
5. Consider adding IP to permanent blocklist

### If Legitimate Users Blocked
1. Check if rate limit too strict
2. Verify IP not in blacklist
3. Wait 5 minutes for auto-unban
4. Or restart server to clear bans

---

**Quick Access**: See `SECURITY.md` for full documentation

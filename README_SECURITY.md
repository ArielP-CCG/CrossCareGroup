# 🔒 Security Implementation - Secure Static Architecture

## 📋 Overview
The Cross Care Group web application has been transitioned to a **Secure Static Architecture**. This eliminates the need for a backend proxy server, reducing the attack surface while maintaining enterprise-grade security via **Content Security Policy (CSP)**, **Static Hosting Headers**, and **Direct-to-API** integration with Power Automate.

---

## 🎯 Quick Overview

### ✅ **Security Measures Implemented**

| Category | Features | Status |
|----------|----------|--------|
| **Architecture** | Serverless / Static (No Backend Logic) | ✅ Complete |
| **API Security** | Direct access to Power Automate via obfuscated endpoints | ✅ Complete |
| **Headers** | CSP, HSTS, X-Frame-Options (via `.htaccess`) | ✅ Complete |
| **Input Security** | Client-side XSS prevention, Sanitization | ✅ Complete |
| **File Upload** | Type/Size validation, Metadata-stripping (Client-side) | ✅ Complete |
| **Access Control** | OIDC Preparedness (PKCE Reference Implementation) | ✅ Ready for Config |
| **Deployment** | CI/CD Pipeline with Secrets Management | ✅ Complete |

---

## 📁 Key Files

### **1. `js/config.js`**
Centralized client-side configuration.
- Stores API endpoints (Power Automate URLs).
- Configures Authentication defaults.
- **Note**: This file is public. Do not store secret keys here.

### **2. `js/forms.js`**
The core form engine.
- **Rate Limiting**: Client-side throttle (5 requests/min) to prevent abuse.
- **XSS Prevention**: Sanitizes all inputs before direct API transmission.
- **File Validation**: Enforces strict file types (.pdf, .doc, images) and size limits (10MB) before upload.

### **3. `.htaccess`** (SiteGround / Apache)
Enforces security headers at the web server level.
- **Strict CSP**: Limits execution to trusted scripts only.
- **HSTS**: Forces HTTPS.
- **X-content-Type**: Prevents MIME-sniffing.

### **4. `.github/workflows/deploy.yml`**
Secure CI/CD pipeline.
- Deploys changes automatically to SiteGround.
- Uses GitHub Secrets (`FTP_PASSWORD`) to keep credentials safe.

---

## 🔐 Security Features Breakdown

### **1. Content Security Policy (CSP)**
A strict policy is applied to all HTML files and enforced via `.htaccess`.
- **Scripts**: Only `self`, Tailwind CDN, and Google Tag Manager.
- **Connect**: Only `self` and `*.powerplatform.com` (Power Automate).
- **Frames**: Only `youtube.com` (for embedded content).
- **Objects**: Blocked (`object-src 'none'`).

### **2. Form Security**
- **Rate Limiting**: 
  - *Client-Side*: Blocks rapid-fire submissions (e.g., >5 per minute) in the browser.
  - *Server-Side*: Power Automate flows should have their own concurrency limits configured.
- **Validation**: 
  - Prevents non-document file uploads.
  - Prevents extremely large payloads.

### **3. Infrastructure Security**
- **Static Hosting**: 
  - No database to inject SQL into.
  - No server-side code to exploit (RCE).
  - Reduced DDoS impact (handled by SiteGround CDN/WAF).
- **Secrets Management**:
  - No secrets stored in the repo.
  - API URLs are tokenized SAS URLs (limited scope).

---

## 🚀 Getting Started

### **1. Local Testing**
```bash
# Run a simple python http server to test (static files only)
python -m http.server 8000
```

### **2. Deployment**
Push to the `main` branch. GitHub Actions will:
1.  Checkout code.
2.  Connect to SiteGround via FTP (using Secrets).
3.  Upload `public_html`.
4.  Apply `.htaccess` rules automatically.

---

## 🔍 Security Monitoring

### **Browser Console**
Check the browser DevTools (F12) for:
- **CSP Violations**: "Refused to load..." (means an unauthorized script tried to run).
- **Network Errors**: Failed API calls (401/403) to Power Automate.

### **Server Logs (SiteGround)**
Check Site Tools > Statistics > Access Log for:
- **403 Forbidden**: Attempts to access protected files.
- **404 Not Found**: Scans for vulnerabilities.

---

## 📚 Documentation Index

1.  **[Deployment Guide](deployment_guide_siteground.md)** - How to deploy and configure secrets.
2.  **`SECURITY.md`** - (Archives) Previous Python-based security reference.
3.  **`task.md`** - Project roadmap and completion status.

---

**Last Updated**: 2026-01-30
**Architecture**: Static Web App (Serverless)

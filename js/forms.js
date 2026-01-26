/**
 * Cross Care Group - Standardised Form Submission Engine
 * Updated: Enterprise Security Implementation
 * Features: XSS Prevention, CSRF Protection, Rate Limiting, File Validation
 */

(function () {
  console.log("CCG Form Engine: Enterprise Security Mode.");

  // --- SECURITY CONFIGURATION ---
  const SECURITY_CONFIG = {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 5,
    allowedFileTypes: ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.txt'],
    maxFieldLength: 5000,
    rateLimitWindow: 60000, // 1 minute in ms
    rateLimitMax: 5, // max submissions per window
  };

  // Client-side rate limiting
  const submissionTimestamps = [];

  const CONFIG = {
    'submit-support': {
      endpoint: '/api/submit-support',
      title: 'Support Request',
      successMessage: 'Your request has been received. Our clinical team will be in touch shortly.'
    },
    'submit-contact': {
      endpoint: '/api/submit-contact',
      title: 'General Enquiry',
      successMessage: 'Thank you for your enquiry. Our team will respond within one business day.'
    },
    'submit-eoi': {
      endpoint: '/api/submit-eoi',
      title: 'Expression of Interest',
      successMessage: 'Your interest has been registered. Our recruitment team will review your details and reach out.'
    },
    'make-a-referral': {
      endpoint: '/api/make-a-referral',
      title: 'Medical Referral',
      successMessage: 'Referral submitted successfully. Our clinical team will process this shortly.'
    },
    'submit-feedback': {
      endpoint: '/api/submit-feedback',
      title: 'Feedback Submission',
      successMessage: 'Thank you for your feedback. Our management team will review your comments.'
    },
    'submit-complaint': {
      endpoint: '/api/submit-complaint',
      title: 'Complaint Submission',
      successMessage: 'Your complaint has been received. Our quality team will investigate and contact you.'
    }
  };

  // --- SECURITY UTILITIES ---

  /**
   * Enhanced XSS prevention - sanitizes user input
   */
  function sanitize(str) {
    if (typeof str !== 'string') return str;

    // Trim and limit length
    str = str.trim();
    if (str.length > SECURITY_CONFIG.maxFieldLength) {
      str = str.substring(0, SECURITY_CONFIG.maxFieldLength);
    }

    // Create temporary element for HTML encoding
    const div = document.createElement('div');
    div.textContent = str;
    let sanitized = div.innerHTML;

    // Additional protection: remove potentially dangerous patterns
    sanitized = sanitized
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '');

    return sanitized;
  }

  /**
   * Client-side rate limiting
   */
  function checkRateLimit() {
    const now = Date.now();

    // Remove old timestamps
    while (submissionTimestamps.length > 0 &&
      now - submissionTimestamps[0] > SECURITY_CONFIG.rateLimitWindow) {
      submissionTimestamps.shift();
    }

    // Check if limit exceeded
    if (submissionTimestamps.length >= SECURITY_CONFIG.rateLimitMax) {
      return false;
    }

    submissionTimestamps.push(now);
    return true;
  }

  /**
   * Validate file uploads
   */
  function validateFile(file) {
    // Check file size
    if (file.size > SECURITY_CONFIG.maxFileSize) {
      throw new Error(`File "${file.name}" is too large. Maximum size is ${SECURITY_CONFIG.maxFileSize / (1024 * 1024)}MB.`);
    }

    // Check file type
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!SECURITY_CONFIG.allowedFileTypes.includes(ext)) {
      throw new Error(`File type "${ext}" is not allowed. Allowed types: ${SECURITY_CONFIG.allowedFileTypes.join(', ')}`);
    }

    // Check for double extensions (e.g., file.pdf.exe)
    const parts = file.name.split('.');
    if (parts.length > 2) {
      const secondExt = '.' + parts[parts.length - 2].toLowerCase();
      if (SECURITY_CONFIG.allowedFileTypes.includes(secondExt)) {
        throw new Error(`Suspicious file name detected: "${file.name}". Please rename the file.`);
      }
    }

    return true;
  }

  /**
   * Generate a simple CSRF token (stored in sessionStorage)
   */
  function getCSRFToken() {
    let token = sessionStorage.getItem('ccg_csrf_token');
    if (!token) {
      token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      sessionStorage.setItem('ccg_csrf_token', token);
    }
    return token;
  }

  function showModal(type, title, message) {
    const existing = document.getElementById('ccg-modal-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'ccg-modal-overlay';
    overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 59, 92, 0.4); backdrop-filter: blur(8px);
            display: flex; align-items: center; justify-content: center;
            z-index: 9999; opacity: 0; transition: opacity 0.4s ease;
        `;

    const modal = document.createElement('div');
    modal.style.cssText = `
            background: white; width: 90%; max-width: 500px;
            padding: 3rem; border-radius: 2rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.1);
            text-align: center; transform: translateY(20px); transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        `;

    let iconHtml = '';
    let buttonHtml = '';

    if (type === 'loading') {
      iconHtml = `
            <div style="width: 80px; height: 80px; background: #0096A115; color: #0096A1; border-radius: 2rem; margin: 0 auto 2rem; display: flex; align-items: center; justify-content: center;">
                <svg class="animate-spin" style="width: 40px; height: 40px;" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        `;
    } else {
      const isSuccess = type === 'success';
      const iconColor = isSuccess ? '#0096A1' : '#EF4444';
      const iconSvg = isSuccess
        ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>'
        : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';

      iconHtml = `
            <div style="width: 80px; height: 80px; background: ${iconColor}15; color: ${iconColor}; border-radius: 2rem; margin: 0 auto 2rem; display: flex; align-items: center; justify-content: center;">
                <svg style="width: 40px; height: 40px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">${iconSvg}</svg>
            </div>
        `;
      buttonHtml = `
            <button id="ccg-modal-close" style="background: #003B5C; color: white; border: none; padding: 1rem 2.5rem; border-radius: 100px; font-weight: 700; font-size: 0.875rem; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 10px 15px -3px rgba(0, 59, 92, 0.2);">
                Dismiss
            </button>
        `;
    }

    modal.innerHTML = `
            ${iconHtml}
            <h2 style="color: #003B5C; font-size: 1.75rem; font-weight: 800; margin-bottom: 1rem;">${title}</h2>
            <p style="color: #64748B; font-size: 1rem; line-height: 1.6; margin-bottom: 2.5rem;">${message}</p>
            ${buttonHtml}
        `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      modal.style.transform = 'translateY(0)';
    });

    if (type !== 'loading') {
      const close = () => {
        overlay.style.opacity = '0';
        modal.style.transform = 'translateY(20px)';
        setTimeout(() => {
          overlay.remove();
          if (type === 'success') window.location.reload();
        }, 400);
      };
      overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
      const closeBtn = document.getElementById('ccg-modal-close');
      if (closeBtn) closeBtn.addEventListener('click', close);
    }
  }

  document.addEventListener('submit', async function (e) {
    const form = e.target;
    const formType = form.getAttribute('data-ccg-form');

    if (formType && CONFIG[formType]) {
      e.preventDefault();
      e.stopPropagation();

      const config = CONFIG[formType];
      const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('.btn');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit';

      try {
        // 1. Client-side rate limiting
        if (!checkRateLimit()) {
          throw new Error('Too many submissions. Please wait a minute before trying again.');
        }

        showModal('loading', 'Processing Request', 'Please wait while we securely transmit your details...');

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `<span>Processing...</span>`;
        }

        const fields = {};
        for (const element of form.elements) {
          if (!element.name || ['Source', 'form-name', '_redirect'].includes(element.name)) continue;

          if (element.type === 'checkbox') {
            const group = form.querySelectorAll(`input[name="${element.name}"][type="checkbox"]`);
            if (group.length > 1) {
              if (!fields[element.name]) fields[element.name] = [];
              if (element.checked) fields[element.name].push(sanitize(element.value));
            } else {
              fields[element.name] = element.checked;
            }
          } else if (element.type === 'radio') {
            if (element.checked) fields[element.name] = sanitize(element.value);
          } else if (element.type !== 'submit' && element.type !== 'button' && element.type !== 'file') {
            fields[element.name] = sanitize(element.value);
          }
        }

        // Clean up checkbox arrays to strings
        for (const key in fields) {
          if (Array.isArray(fields[key])) fields[key] = fields[key].join(', ');
        }

        // 2. Validate and process file uploads
        let attachments = [];
        const fileInput = form.querySelector('input[type="file"]');
        if (fileInput && fileInput.files.length > 0) {
          // Check file count
          if (fileInput.files.length > SECURITY_CONFIG.maxFiles) {
            throw new Error(`Too many files. Maximum ${SECURITY_CONFIG.maxFiles} files allowed.`);
          }

          // Validate each file
          for (const file of fileInput.files) {
            validateFile(file);
          }

          const processFiles = Array.from(fileInput.files).map(async (file, index) => {
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = (event) => {
                try {
                  let finalName = file.name;
                  // Sanitize filename
                  finalName = finalName.replace(/[^a-zA-Z0-9._-]/g, '_');

                  if (formType === 'make-a-referral') {
                    const clientFullName = (fields['ref_clientFullName'] || 'Referrer').replace(/[^a-z0-9]/gi, '_');
                    const dateToday = new Date().toISOString().split('T')[0].replace(/-/g, '');
                    const ext = file.name.split('.').pop();
                    finalName = `${clientFullName}_${dateToday}_${index + 1}.${ext}`;
                  }
                  resolve({ name: finalName, content: event.target.result.split(',')[1] });
                } catch (err) {
                  reject(err);
                }
              };
              reader.onerror = () => reject(new Error('Failed to read file'));
              reader.readAsDataURL(file);
            });
          });
          attachments = await Promise.all(processFiles);
        }

        // 3. Build secure payload
        const payload = { fields };
        if (attachments.length > 0) payload.attachments = attachments;

        // Add CSRF token
        const csrfToken = getCSRFToken();

        // 4. Submit to backend
        const response = await fetch(config.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken
          },
          body: JSON.stringify(payload),
          credentials: 'same-origin' // Include cookies for additional security
        });

        // 5. Handle response
        if (response.ok) {
          showModal('success', 'Submission Successful', config.successMessage);
          form.reset();
          // Clear file input
          if (fileInput) fileInput.value = '';
        } else if (response.status === 429) {
          throw new Error('Too many requests. Please wait a minute and try again.');
        } else if (response.status === 400) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Invalid submission. Please check your inputs.');
        } else if (response.status === 413) {
          throw new Error('Files are too large. Please reduce file sizes and try again.');
        } else if (response.status >= 500) {
          throw new Error('Server error. Our team has been notified. Please try again later.');
        } else {
          throw new Error(`Submission failed (${response.status}). Please try again later.`);
        }

      } catch (err) {
        console.error('Form submission error:', err);
        // Show user-friendly error message
        const errorMessage = err.message || 'An unexpected error occurred. Please try again.';
        showModal('error', 'Submission Failed', errorMessage);

        // Remove the last timestamp from rate limit if submission failed
        if (submissionTimestamps.length > 0) {
          submissionTimestamps.pop();
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    }
  }, true);
})();

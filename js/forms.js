/**
 * Cross Care Group - Standardised Form Submission Engine
 * Updated: Static Architecture (Direct-to-API)
 * Features: XSS Prevention, Rate Limiting, File Validation, Direct Power Automate Integration
 */

(function () {
  console.log("CCG Form Engine: Static Secure Mode.");

  // Check if Config is loaded
  if (typeof WINDOW_CONFIG === 'undefined') {
    console.error("CRITICAL: WINDOW_CONFIG not loaded. Form submission will fail.");
    return;
  }

  const SECURITY_CONFIG = WINDOW_CONFIG.SECURITY;

  // Map form types to Config Endpoints
  const ENDPOINTS = {
    'submit-support': { url: WINDOW_CONFIG.API.SUPPORT, title: 'Support Request', success: 'Thank you. Your support request has been received. Our team will review it and respond shortly.' },
    'submit-contact': { url: WINDOW_CONFIG.API.ENQUIRY, title: 'General Enquiry', success: 'Thank you. We have received your enquiry and will respond as soon as possible' },
    'submit-eoi': { url: WINDOW_CONFIG.API.EOI, title: 'Expression of Interest', success: 'Thank you. Your expression of interest has been recorded and will be reviewed by our team.' },
    'make-a-referral': { url: WINDOW_CONFIG.API.REFERRAL, title: 'Medical Referral', success: 'Thank you. Your referral has been submitted successfully. We will contact you if any further information is required.' },
    'submit-feedback': { url: WINDOW_CONFIG.API.FEEDBACK, title: 'Feedback Submission', success: 'Thank you. Your feedback has been received and recorded.', type: 'Feedback' },
    'submit-complaint': { url: WINDOW_CONFIG.API.FEEDBACK, title: 'Complaint Submission', success: 'Thank you. Your complaint has been submitted successfully and will be reviewed in line with our process.', type: 'Complaint' }
  };

  // Client-side rate limiting
  const submissionTimestamps = [];
  const RATE_LIMIT_WINDOW = 60000;
  const RATE_LIMIT_MAX = 5;

  /**
   * Enhanced XSS prevention - sanitizes user input
   */
  function sanitize(str) {
    if (typeof str !== 'string') return str;
    str = str.trim();
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Client-side rate limiting
   */
  function checkRateLimit() {
    const now = Date.now();
    while (submissionTimestamps.length > 0 && now - submissionTimestamps[0] > RATE_LIMIT_WINDOW) {
      submissionTimestamps.shift();
    }
    if (submissionTimestamps.length >= RATE_LIMIT_MAX) return false;
    submissionTimestamps.push(now);
    return true;
  }

  /**
   * Validate file uploads
   */
  function validateFile(file) {
    if (file.size > SECURITY_CONFIG.MAX_FILE_SIZE) {
      throw new Error(`File "${file.name}" is too large. Max ${SECURITY_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB.`);
    }
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!SECURITY_CONFIG.ALLOWED_FILE_TYPES.includes(ext)) {
      throw new Error(`File type "${ext}" is not allowed.`);
    }
    return true;
  }

  function showModal(type, title, message) {
    const existing = document.getElementById('ccg-modal-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'ccg-modal-overlay';
    // Glassmorphism backdrop
    overlay.className = 'fixed inset-0 z-[9999] flex items-center justify-center px-4 transition-all duration-300 opacity-0';
    overlay.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0, 59, 92, 0.6); backdrop-filter: blur(12px);
      display: flex; align-items: center; justify-content: center; z-index: 9999;
    `;

    const modal = document.createElement('div');
    // Premium card design
    modal.style.cssText = `
      background: white; width: 100%; max-width: 480px; padding: 2.5rem;
      border-radius: 2rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      text-align: center; transform: scale(0.95) translateY(10px);
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative; overflow: hidden;
    `;

    // Decorative top accent
    const accent = document.createElement('div');
    accent.style.cssText = `
      position: absolute; top: 0; left: 0; width: 100%; height: 6px;
      background: ${type === 'success' ? '#0096A1' : (type === 'error' ? '#EF4444' : '#003B5C')};
    `;
    modal.appendChild(accent);

    let iconHtml = '';
    const color = type === 'success' ? '#0096A1' : (type === 'error' ? '#EF4444' : '#003B5C');

    if (type === 'loading') {
      iconHtml = `
        <div class="relative flex justify-center items-center mb-6">
            <div class="absolute w-16 h-16 rounded-full border-4 border-slate-100"></div>
            <div class="w-16 h-16 rounded-full border-4 border-t-transparent animate-spin" style="border-color: ${color} transparent transparent transparent"></div>
        </div>`;
    } else {
      const path = type === 'success'
        ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
        : 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';

      iconHtml = `
        <div style="margin: 0 auto 1.5rem; color: ${color}; background: ${color}15; width: 4rem; height: 4rem; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <svg style="width: 2rem; height: 2rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="${path}"></path>
            </svg>
        </div>`;
    }

    let displayMessage = message;

    if (type === 'error') {
      displayMessage = `We couldn't process your request at this moment. Please try again shortly, or contact us directly at <a href="mailto:clientservices@crosscaregroup.com.au" style="color: #0096A1; font-weight: 700; text-decoration: underline;">clientservices@crosscaregroup.com.au</a>`;
    }

    modal.innerHTML = `
      ${accent.outerHTML}
      <div style="position: relative; z-index: 10;">
          ${iconHtml}
          <h3 style="color: #003B5C; font-size: 1.75rem; font-weight: 800; margin-bottom: 0.75rem; letter-spacing: -0.025em; line-height: 1.2;">
            ${title}
          </h3>
          <p style="color: #64748B; font-size: 1rem; line-height: 1.6; margin-bottom: 2rem; font-weight: 500;">
            ${displayMessage}
          </p>
          ${type !== 'loading' ? `
            <button id="ccg-close-modal" style="
                background: #003B5C; color: white; border: none;
                padding: 1rem 2.5rem; border-radius: 9999px; font-weight: 700; font-size: 0.95rem;
                letter-spacing: 0.05em; text-transform: uppercase; cursor: pointer;
                box-shadow: 0 10px 15px -3px rgba(0, 59, 92, 0.2); transition: all 0.2s;
            " onmouseover="this.style.transform='translateY(-2px)';" onmouseout="this.style.transform='translateY(0)';">
                ${type === 'success' ? 'Continue' : 'Close'}
            </button>
          ` : ''}
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      modal.style.transform = 'scale(1) translateY(0)';
    });

    if (type !== 'loading') {
      const close = () => {
        overlay.style.opacity = '0';
        modal.style.transform = 'scale(0.95) translateY(10px)';
        setTimeout(() => overlay.remove(), 300);
        if (type === 'success') window.location.reload();
      };
      const btn = document.getElementById('ccg-close-modal');
      if (btn) btn.addEventListener('click', close);
    }
  }

  document.addEventListener('submit', async function (e) {
    const form = e.target;
    const formType = form.getAttribute('data-ccg-form');

    if (!formType || !ENDPOINTS[formType]) return;

    e.preventDefault();
    const config = ENDPOINTS[formType];
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';

    try {
      if (!checkRateLimit()) throw new Error('You are doing that too much. Please wait 60 seconds.');

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending...';
      }
      showModal('loading', 'Sending Request', 'Securely transmitting your data...');

      // Collect fields
      const fields = {};
      const formData = new FormData(form);

      for (const [key, value] of formData.entries()) {
        // Exclude internal fields and File Inputs handled separately
        if (key === 'files' || key === 'eoi_cv' || key === 'attachment') continue;

        if (fields[key]) {
          fields[key] = Array.isArray(fields[key]) ? [...fields[key], sanitize(value)] : [fields[key], sanitize(value)];
        } else {
          fields[key] = sanitize(value);
        }
      }

      // Convert arrays to strings for readability (checkboxes)
      for (let key in fields) {
        if (Array.isArray(fields[key])) fields[key] = fields[key].join(', ');
      }

      // Injection for specific types if config requires it (e.g. feedback vs complaint)
      if (config.type) fields['caf_type'] = config.type;

      // File Handling - Standardized 'attachments' array
      let attachments = [];
      const fileInput = form.querySelector('input[type="file"]');
      if (fileInput && fileInput.files.length > 0) {
        if (fileInput.files.length > SECURITY_CONFIG.MAX_FILES) throw new Error(`Too many files. Max ${SECURITY_CONFIG.MAX_FILES}.`);

        for (const file of fileInput.files) {
          validateFile(file);
          const reader = new FileReader();
          const filePromise = new Promise((resolve, reject) => {
            reader.onload = e => resolve({
              name: file.name.replace(/[^a-zA-Z0-9._-]/g, '_'),
              content: e.target.result.split(',')[1] // 'content' per schema
            });
            reader.onerror = reject;
          });
          reader.readAsDataURL(file);
          attachments.push(await filePromise);
        }
      }

      // CONSTRUCT PAYLOAD
      const payload = { ...fields };

      // Helper: Convert likely boolean fields (checkboxes) from "on" to true, and ensure required booleans exist
      const booleanFields = ['enq_consent', 'enq_send_catalogue', 'is_urgent', 'ref_authority', 'ref_consent', 'eoi_consent', 'caf_consent_call'];

      // 1. Convert checked "on" values to true
      for (const key in payload) {
        if (payload[key] === 'on' || payload[key] === 'true') {
          // Heuristic: if it's in our boolean list or looks like a flag
          if (key.toLowerCase().includes('consent') || key.startsWith('is_') || booleanFields.includes(key)) {
            payload[key] = true;
          }
        }
      }

      // 2. Ensure missing boolean fields are sent as false (if they exist in the form but were unchecked)
      booleanFields.forEach(field => {
        const input = form.querySelector(`input[name="${field}"]`);
        if (input && input.type === 'checkbox') {
          if (!payload[field]) {
            payload[field] = false;
          }
        }
      });

      // 3. Convert Numeric Fields (Float)
      const numericFields = ['ref_fundingAvailable'];
      numericFields.forEach(field => {
        if (payload[field]) {
          const num = parseFloat(payload[field]);
          if (!isNaN(num)) {
            payload[field] = num;
          } else {
            delete payload[field]; // remove invalid numbers
          }
        }
      });

      if (attachments.length > 0) payload.attachments = attachments;

      // DEBUG: Log payload for verification
      // DEBUG: Log payload for verification - REMOVED for Production Security

      // Fetch
      const response = await fetch(config.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        showModal('success', 'Request Sent', config.success);
        form.reset();
      } else {
        const errorText = await response.text();
        throw new Error(`Server returned ${response.status} - ${errorText}`);
      }

    } catch (err) {
      console.error(err);
      showModal('error', 'Submission Failed', err.message || 'An unexpected error occurred.');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }
  });

})();

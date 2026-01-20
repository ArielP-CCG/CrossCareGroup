/**
 * Cross Care Group - Standardised Form Submission Engine
 * Features: Global event delegation, modal feedback, and explicit redirection blocking.
 */

(function () {
  console.log("CCG Form Engine: Initializing scorched-earth redirection block...");



  /**
   * Security: Input Sanitization
   */
  function sanitize(str) {
    if (typeof str !== 'string') return str;
    const div = document.createElement('div');
    div.textContent = str.trim();
    return div.innerHTML;
  }

  /**
   * Security: Client-side Rate Limiting (60s cooldown)
   */
  function checkRateLimit(formType) {
    const lastSubmit = localStorage.getItem(`ccg_last_submit_${formType}`);
    const now = Date.now();
    if (lastSubmit && (now - lastSubmit < 60000)) {
      const remaining = Math.ceil((60000 - (now - lastSubmit)) / 1000);
      throw new Error(`Please wait ${remaining} seconds before submitting again.`);
    }
  }

  /**
   * Determine API Base URL
   */
  const getBaseUrl = (config) => {
    if (config.isExternal) return '';
    if (window.location.protocol === 'file:') return 'http://localhost:8001';
    return '';
  };

  /**
   * UI Helper: Show Premium Modal
   */
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

  /**
   * Autonomic Environment Loader
   * Fetches and parses .env file at runtime
   */
  async function loadEnv() {
    try {
      // Find relative path to root .env
      const path = window.location.pathname;
      const pathDepth = path.endsWith('/') ? path.split('/').filter(p => p).length : path.split('/').filter(p => p).length - 1;
      const dotDot = '../'.repeat(Math.max(0, pathDepth)) || './';
      const response = await fetch(dotDot + '.env');
      if (!response.ok) return;

      const text = await response.text();
      window.CCG_ENV = {};

      text.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...valueParts] = trimmed.split('=');
          window.CCG_ENV[key.trim()] = valueParts.join('=').trim();
        }
      });
      console.log("CCG Form Engine: Runtime .env loaded.");
    } catch (e) {
      console.warn("CCG Form Engine: .env runtime load skipped/failed.");
    }
  }

  const envPromise = loadEnv();

  /**
   * Global Event Listener: Intercept ALL Form Submissions
   */
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
        // Direct first: Only wait for env if endpoint isn't a full URL
        if (config.isExternal && !config.endpoint.startsWith('http')) {
          await envPromise;
        }

        checkRateLimit(formType);
        showModal('loading', 'Processing Request', 'Please wait while we securely transmit your details...');

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `<span>Processing...</span>`;
        }

        const fields = {};
        const checkboxGroups = {};

        for (const element of form.elements) {
          if (!element.name || ['Source', 'form-name', '_redirect'].includes(element.name)) continue;

          if (element.type === 'checkbox') {
            const group = form.querySelectorAll(`input[name="${element.name}"][type="checkbox"]`);
            if (group.length > 1) {
              if (!checkboxGroups[element.name]) checkboxGroups[element.name] = [];
              if (element.checked) checkboxGroups[element.name].push(sanitize(element.value));
            } else {
              fields[element.name] = element.checked;
            }
          } else if (element.type === 'radio') {
            if (element.checked) fields[element.name] = sanitize(element.value);
          } else if (element.type !== 'submit' && element.type !== 'button' && element.type !== 'file') {
            fields[element.name] = sanitize(element.value);
          }
        }

        for (const [name, values] of Object.entries(checkboxGroups)) {
          fields[name] = values.join(', ');
        }

        // Apply NDIS Date Defaults
        if (formType === 'make-a-referral') {
          if (!fields['ref_ndisStart']) fields['ref_ndisStart'] = '12/31/9999';
          if (!fields['ref_ndisEnd']) fields['ref_ndisEnd'] = '12/31/9999';
        }

        let attachments = [];
        if (formType !== 'submit-support') {
          const fileInput = form.querySelector('input[type="file"]');
          if (fileInput && fileInput.files.length > 0) {
            const processFiles = Array.from(fileInput.files).map((file, index) => {
              return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                  let finalName = file.name;
                  if (formType === 'make-a-referral') {
                    const referrerName = (fields['Title'] || 'Referrer').replace(/[^a-z0-9]/gi, '_');
                    const dateToday = new Date().toISOString().split('T')[0].replace(/-/g, '');
                    finalName = `${referrerName}_${dateToday}_${index + 1}.${file.name.split('.').pop()}`;
                  }
                  resolve({ name: finalName, content: event.target.result.split(',')[1] });
                };
                reader.readAsDataURL(file);
              });
            });
            attachments = await Promise.all(processFiles);
            if (formType === 'make-a-referral') {
              fields['ref_attachement'] = attachments.map(a => a.name).join('; ');
            }
          }
        }

        const baseUrl = getBaseUrl(config);
        const dynamicUrl = (window.CCG_ENV && window.CCG_ENV[config.envKey]);

        // Prioritize dynamicUrl from .env if available
        let url = dynamicUrl || window[config.envKey] || window['VITE_' + config.envKey];

        if (config.isExternal) {
          if (!url) {
            url = config.endpoint;
          }
        } else {
          url = baseUrl + config.endpoint;
        }

        // Optimized payload: Only include attachments if they exist
        let payload;
        if (config.isExternal) {
          payload = { ...fields };
          if (attachments.length > 0) payload.attachments = attachments;
        } else {
          payload = { fields };
          if (attachments.length > 0) payload.attachments = attachments;
        }

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          localStorage.setItem(`ccg_last_submit_${formType}`, Date.now());
          showModal('success', 'Submission Successful', config.successMessage);
          form.reset();
        } else {
          throw new Error(`Server responded with ${response.status}`);
        }

      } catch (err) {
        showModal('error', 'Submission Failed', err.message || 'We encountered an error. Please try again or contact us.');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    }
  }, true);

  console.log("CCG Form Engine: Active.");
})();

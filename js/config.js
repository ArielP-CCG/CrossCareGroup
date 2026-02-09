/**
 * Application Configuration
 * 
 * WARNING: This file is visible to the client. 
 * Do NOT store secrets (client_secret, API keys) here.
 */

const CONFIG = {
    // API Endpoints (Power Automate / Logic Apps)
    API: {
        SUPPORT: 'https://default62387c81b78a4297a98ab561cfb1fa.9b.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/3f057301f6314dbaaf30a883fddd6ae4/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ZJOW_LFMtu_OV7ZGul49DwGYR5Mq3Aiy9LscYTxHeLs',
        ENQUIRY: 'https://default62387c81b78a4297a98ab561cfb1fa.9b.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/466964e7e4b64af2913dae59ce373bdf/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=2mgBzbBNat0gmApurMWji0IZz_KhpgoLh7MkZqqTZPk',
        EOI: 'https://default62387c81b78a4297a98ab561cfb1fa.9b.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/fdfe471cdf4345579059451edd3ac1df/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=M4qyKkZb1tiVoujkDN7GICoY_Zhz8kLNzy5BVOXfIzM',
        REFERRAL: 'https://default62387c81b78a4297a98ab561cfb1fa.9b.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/514b977eb1164a79a4114a73c4759edf/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=LSYrB6kvcMKyVqhwiG1-SS0h7QOzr3hD81PI8CP6F3k',
        FEEDBACK: 'https://default62387c81b78a4297a98ab561cfb1fa.9b.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/aaff66816d914cba9b7796a56a03703a/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=FYk-21PGJOdLk4u6DF0lxnLtLd7wqK3yuc14X6TDeyA',
    },

    // Auth Configuration (OIDC) - Placeholders for now
    AUTH: {
        AUTHORITY: 'https://your-idp.com',
        CLIENT_ID: 'your-client-id',
        REDIRECT_URI: window.location.origin + '/callback.html',
        SCOPE: 'openid profile email',
    },

    // Security Settings
    SECURITY: {
        MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
        ALLOWED_FILE_TYPES: ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'],
        MAX_FILES: 5
    }
};

// Deep Freeze Helper
function deepFreeze(object) {
    // Retrieve the property names defined on object
    const propNames = Object.getOwnPropertyNames(object);

    // Freeze properties before freezing self
    for (const name of propNames) {
        const value = object[name];

        if (value && typeof value === "object") {
            deepFreeze(value);
        }
    }

    return Object.freeze(object);
}

// Prevent modification in runtime
deepFreeze(CONFIG);

// Expose to global scope as WINDOW_CONFIG safely
Object.defineProperty(window, 'WINDOW_CONFIG', {
    value: CONFIG,
    writable: false,
    configurable: false
});

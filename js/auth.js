/**
 * Cross Care Group - Authentication Module (OIDC + PKCE)
 */
class AuthService {
    constructor() {
        this.config = WINDOW_CONFIG.AUTH;
        this.stateKey = 'auth_state';
        this.codeVerifierKey = 'auth_code_verifier';
        this.tokenKey = 'auth_token';
    }

    // Generate Random String for State and Code Verifier
    generateRandomString(length) {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
        const array = new Uint8Array(length);
        window.crypto.getRandomValues(array);
        return Array.from(array).map(x => charset[x % charset.length]).join('');
    }

    // SHA-256 Hash
    async sha256(plain) {
        const encoder = new TextEncoder();
        const data = encoder.encode(plain);
        const hash = await window.crypto.subtle.digest('SHA-256', data);
        return hash;
    }

    // Base64URL Encode
    base64urlencode(a) {
        let str = "";
        const bytes = new Uint8Array(a);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            str += String.fromCharCode(bytes[i]);
        }
        return btoa(str)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    // Challenge Generation
    async generateCodeChallenge(v) {
        const hashed = await this.sha256(v);
        return this.base64urlencode(hashed);
    }

    // Login Flow
    async login() {
        const state = this.generateRandomString(16);
        const codeVerifier = this.generateRandomString(64);
        const codeChallenge = await this.generateCodeChallenge(codeVerifier);

        // Store state and verifier
        sessionStorage.setItem(this.stateKey, state);
        sessionStorage.setItem(this.codeVerifierKey, codeVerifier);

        // Build Auth URL
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: this.config.CLIENT_ID,
            redirect_uri: this.config.REDIRECT_URI,
            scope: this.config.SCOPE,
            state: state,
            code_challenge: codeChallenge,
            code_challenge_method: 'S256'
        });

        window.location.href = `${this.config.AUTHORITY}/authorize?${params.toString()}`;
    }

    // Handle Callback (to be called on callback.html)
    async handleCallback() {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const state = params.get('state');
        const storedState = sessionStorage.getItem(this.stateKey);

        if (state !== storedState) {
            throw new Error('Invalid state');
        }

        const codeVerifier = sessionStorage.getItem(this.codeVerifierKey);

        // Exchange code for token
        const tokenResponse = await fetch(`${this.config.AUTHORITY}/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: this.config.CLIENT_ID,
                code_verifier: codeVerifier,
                code: code,
                redirect_uri: this.config.REDIRECT_URI
            })
        });

        if (!tokenResponse.ok) throw new Error('Token exchange failed');

        const tokens = await tokenResponse.json();
        sessionStorage.setItem(this.tokenKey, JSON.stringify(tokens));

        // Clean up
        sessionStorage.removeItem(this.stateKey);
        sessionStorage.removeItem(this.codeVerifierKey);

        return tokens;
    }

    getToken() {
        const tokens = sessionStorage.getItem(this.tokenKey);
        if (!tokens) return null;
        const parsed = JSON.parse(tokens);
        // Simple check, real app should check expiry
        return parsed.access_token;
    }

    logout() {
        sessionStorage.removeItem(this.tokenKey);
        window.location.href = '/';
    }
}

// Export instance
const authService = new AuthService();

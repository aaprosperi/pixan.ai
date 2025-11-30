# Changelog

All notable changes to Pixan.ai will be documented in this file.

## [2.1.0] - 2025-01-30

### 🔥 Critical Fixes
- **Fixed input bug** in `api-admin.js` that caused character-by-character typing issue
  - Implemented proper state management with editing mode
  - Prevented re-renders during user input
  - Location: `pages/api-admin.js:405-449`

### 🔒 Security Enhancements
- **Implemented real encryption** using Web Crypto API
  - AES-GCM encryption for API keys in localStorage
  - PBKDF2 key derivation with 100,000 iterations
  - Replaced base64 obfuscation with actual cryptography
  - New library: `lib/secure-storage.js`

- **Added comprehensive security headers**
  - Strict-Transport-Security with HSTS
  - Content-Security-Policy (CSP)
  - X-Frame-Options, X-Content-Type-Options
  - Permissions-Policy
  - Configured in `next.config.js`

- **Implemented rate limiting** on API routes
  - Token bucket algorithm
  - Configurable limits per endpoint type
  - Auth endpoints: 5 requests per 5 minutes
  - LLM endpoints: 10 requests per minute
  - New library: `lib/rate-limiter.js`

### 🛡️ Reliability & Error Handling
- **Created Error Boundaries**
  - Global error boundary in `_app.js`
  - Graceful error recovery
  - User-friendly error messages
  - Development vs production error details
  - Component: `components/ErrorBoundary.js`

- **Implemented structured logging system**
  - Multiple log levels (DEBUG, INFO, WARN, ERROR, FATAL)
  - Browser console and localStorage transports
  - Automatic error tracking
  - Global error handlers
  - Library: `lib/logger.js`

### ✅ Validation & Data Integrity
- **Created validation schemas**
  - Schema-based validation system
  - Common validators (string, number, email, URL, API keys)
  - Pre-built schemas for auth, LLM queries, etc.
  - Library: `lib/validation.js`

### 🚀 Performance & Architecture
- **Configured TypeScript**
  - Full TypeScript support (allows JS too)
  - Path aliases (@/components, @/lib, etc.)
  - Incremental compilation
  - Config: `tsconfig.json`

- **Webpack optimizations**
  - Proper fallbacks for client-side crypto
  - Optimized bundle splitting
  - Updated in `next.config.js`

### 🔄 CI/CD
- **GitHub Actions workflow**
  - Automated linting
  - Build verification
  - Test execution
  - Security audits
  - Dependency checks
  - Vercel deployment integration
  - File: `.github/workflows/ci.yml`

### 📝 Code Quality
- **Updated encryption across application**
  - `api-admin.js` now uses secure storage
  - `llmC.js` updated with async key retrieval
  - Consistent encryption password derivation

- **Enhanced API routes**
  - Rate limiting on authentication endpoints
  - Better error handling
  - Structured logging

### 📦 Infrastructure
- **New dependencies** (to be installed):
  - Web Crypto API (built-in browser/Node.js)
  - All security features use native APIs

### 🔧 Configuration
- **Environment improvements**
  - Better CSP configuration
  - API endpoint whitelisting
  - Webpack client-side optimizations

---

## Migration Guide

### For developers updating from v2.0.0:

1. **API Keys will need re-entry**
   - Old base64-encoded keys won't work with new encryption
   - Users need to re-enter their API keys in the admin panel
   - Keys will be properly encrypted with AES-GCM

2. **Environment Variables**
   - No new environment variables required
   - Existing `.env.local` continues to work

3. **Build Process**
   - No changes needed to build commands
   - `npm run build` works as before

4. **TypeScript**
   - TypeScript is configured but optional
   - Existing JavaScript files work without changes
   - Can gradually migrate to `.ts`/`.tsx` files

---

## Breaking Changes

### None
All changes are backward compatible. Existing functionality preserved.

---

## Security Notes

⚠️ **Important**: Users should re-enter their API keys after this update for proper encryption.

🔐 **Encryption Details**:
- Algorithm: AES-GCM-256
- Key Derivation: PBKDF2 with SHA-256
- Iterations: 100,000
- Random salt and IV per encryption

---

## Next Steps

Recommended future enhancements:
- [ ] Add comprehensive test suite (Vitest + Playwright)
- [ ] Implement state management (Zustand)
- [ ] Add React.memo optimizations
- [ ] Enhanced accessibility (ARIA attributes)
- [ ] PWA capabilities
- [ ] Monitoring integration (Sentry)
- [ ] i18n improvements

---

**Generated with Claude Code**

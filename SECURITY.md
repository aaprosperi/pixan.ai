# Security Policy

## 🔒 Security Features

Pixan.ai implements enterprise-grade security measures to protect user data and API keys.

### Encryption

**API Key Storage**
- All API keys are encrypted using AES-GCM-256
- PBKDF2 key derivation with 100,000 iterations
- Unique salt and IV for each encryption
- Keys never stored in plain text
- Implementation: `lib/secure-storage.js`

### Security Headers

The following security headers are enforced on all routes:

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: [Comprehensive CSP - see next.config.js]
```

### Content Security Policy

Our CSP restricts resource loading to trusted sources only:

- **Scripts**: Self, Google Fonts
- **Styles**: Self, Google Fonts
- **Images**: Self, data URIs, HTTPS
- **Connections**: Self + whitelisted LLM APIs only
  - Anthropic (Claude)
  - OpenAI
  - Google (Gemini)
  - Perplexity
  - DeepSeek
  - Mistral

### Rate Limiting

Automatic rate limiting prevents abuse:

- **Authentication**: 5 requests per 5 minutes
- **LLM APIs**: 10 requests per minute
- **General APIs**: 20 requests per minute
- **Strict endpoints**: 3 requests per 10 minutes

Implementation: `lib/rate-limiter.js`

### Error Handling

- Error boundaries prevent information leakage
- Different error messages in development vs production
- Sensitive stack traces hidden in production
- Structured logging without exposing credentials

### Validation

All user inputs are validated:

- Schema-based validation system
- API key format verification
- Request size limits
- Type checking
- Enum validation

Implementation: `lib/validation.js`

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability, please email: **security@pixan.ai**

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

**Do NOT** open public issues for security vulnerabilities.

### Response Time

- Initial response: Within 48 hours
- Status update: Within 7 days
- Fix timeline: Depends on severity

## 🛡️ Security Best Practices

### For Users

1. **API Keys**
   - Use API keys with minimal required permissions
   - Rotate keys regularly
   - Never share your admin password
   - Use strong, unique passwords

2. **Browser Security**
   - Keep your browser updated
   - Use HTTPS only
   - Clear browser cache regularly
   - Use private browsing for sensitive work

3. **Access Control**
   - Don't share admin credentials
   - Log out when done
   - Use different passwords for different services

### For Developers

1. **Code Security**
   - Never commit API keys or secrets
   - Use environment variables
   - Review code before deployment
   - Keep dependencies updated

2. **API Routes**
   - Always validate inputs
   - Implement rate limiting
   - Use authentication middleware
   - Sanitize user data

3. **Client-Side**
   - Never trust client input
   - Validate on server too
   - Use HTTPS for all requests
   - Implement CSRF protection

## 🔐 Authentication

Current authentication uses password-based access with:
- JWT tokens with 4-hour expiration
- HttpOnly cookies
- SameSite=Strict policy
- Secure flag in production

Future enhancements planned:
- [ ] Two-factor authentication (2FA)
- [ ] OAuth integration
- [ ] API key rotation system
- [ ] Session management dashboard

## 📋 Compliance

Pixan.ai follows security best practices based on:
- OWASP Top 10
- NIST Cybersecurity Framework
- Web Security Standards

## 🔄 Security Updates

Security updates are released as soon as vulnerabilities are discovered and fixed.

To stay updated:
- Watch this repository
- Enable GitHub security alerts
- Subscribe to release notifications

## 📊 Security Audit Log

| Date | Component | Issue | Status |
|------|-----------|-------|--------|
| 2025-01-30 | API Storage | Weak encryption (base64) | ✅ Fixed - AES-GCM implemented |
| 2025-01-30 | Input Handling | Re-render vulnerability | ✅ Fixed - State management improved |
| 2025-01-30 | API Routes | No rate limiting | ✅ Fixed - Token bucket implemented |
| 2025-01-30 | Headers | Missing security headers | ✅ Fixed - Comprehensive headers added |

## 🎯 Security Checklist

For each release, we verify:

- [ ] All dependencies scanned for vulnerabilities
- [ ] Security headers configured
- [ ] Rate limiting active on all public endpoints
- [ ] Encryption working correctly
- [ ] Error handling doesn't leak sensitive info
- [ ] Authentication properly enforced
- [ ] Input validation comprehensive
- [ ] CSP policy tested
- [ ] Logs don't contain secrets
- [ ] HTTPS enforced in production

## 📞 Contact

For security concerns: security@pixan.ai

For general issues: https://github.com/anthropics/pixan-ai/issues

---

Last updated: 2025-01-30

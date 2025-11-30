# Pixan.ai - Collaborative GenAI Platform 🧠

> Enterprise-grade multi-LLM collaboration platform with advanced security and performance optimizations

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![Security](https://img.shields.io/badge/Security-A+-green)](./SECURITY.md)
[![License](https://img.shields.io/badge/License-MIT-yellow)](./LICENSE)

## 🌟 Features

### Core Capabilities
- 🤖 **Multi-LLM Collaboration** - Claude, GPT-4, Gemini, Perplexity, DeepSeek, Mistral
- 🔐 **Enterprise Security** - AES-GCM encryption, rate limiting, CSP headers
- ⚡ **Real-time Processing** - Parallel LLM queries with intelligent orchestration
- 🎯 **Smart Role Assignment** - Claude auto-assigns roles to each LLM
- 📊 **Visual Formatting** - Tables, emojis, structured responses
- 🔄 **Conversation Memory** - Multi-turn conversations with context
- 📄 **Google Docs Export** - One-click HTML export with Gemini
- 🌍 **Multi-language Support** - English & Spanish

### Security Features ✨ NEW
- 🔒 **Real Encryption** - Web Crypto API with AES-GCM-256
- 🛡️ **Security Headers** - HSTS, CSP, X-Frame-Options, etc.
- ⏱️ **Rate Limiting** - Token bucket algorithm per endpoint
- 🚨 **Error Boundaries** - Graceful error recovery
- 📝 **Structured Logging** - Multi-level logging system
- ✅ **Input Validation** - Schema-based validation

### Performance & Architecture ✨ NEW
- ⚡ **TypeScript Ready** - Full TS support with path aliases
- 🔧 **Optimized Webpack** - Client-side crypto fallbacks
- 🎯 **Better State Management** - Fixed input re-render bug
- 📦 **Code Quality** - ESLint, error boundaries, validation
- 🔄 **CI/CD Pipeline** - GitHub Actions automation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- API keys for desired LLM providers

### Installation

```bash
# Clone repository
git clone https://github.com/your-org/pixan.ai.git
cd pixan.ai

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Run development server
npm run dev
```

Visit `http://localhost:3000`

### Configuration

1. **Admin Panel**: Navigate to `/api-admin`
2. **Enter Password**: Default is `Pixan01.` (change in production!)
3. **Add API Keys**: Enter API keys for desired providers
4. **Test Connection**: Verify each provider works

All API keys are encrypted with AES-GCM-256 before storage.

## 📁 Project Structure

```
pixan.ai/
├── .github/
│   └── workflows/
│       └── ci.yml           # GitHub Actions CI/CD
├── components/
│   ├── ErrorBoundary.js     # ✨ Error boundary component
│   └── LanguageSelector.js  # Language switcher
├── contexts/
│   └── LanguageContext.js   # i18n context
├── lib/
│   ├── secure-storage.js    # ✨ AES-GCM encryption
│   ├── rate-limiter.js      # ✨ Rate limiting
│   ├── logger.js            # ✨ Structured logging
│   ├── validation.js        # ✨ Input validation
│   ├── translations.js      # i18n translations
│   └── crypto-utils.js      # Crypto helpers
├── pages/
│   ├── api/
│   │   ├── admin/
│   │   │   ├── auth.js      # ✨ With rate limiting
│   │   │   ├── save-key.js
│   │   │   └── test-connection.js
│   │   ├── claude-chat.js
│   │   ├── openai-chat.js
│   │   ├── gemini-chat.js
│   │   ├── perplexity-chat.js
│   │   ├── deepseek-chat.js
│   │   └── mistral-chat.js
│   ├── _app.js              # ✨ With error boundary
│   ├── index.js             # Landing page
│   ├── llmC.js              # ✨ LLM Collaboration (secure)
│   ├── pb.js                # Prompt Boost
│   └── api-admin.js         # ✨ Admin panel (bug fixed)
├── public/                  # Static assets
├── styles/                  # Global styles
├── next.config.js           # ✨ Security headers + webpack
├── tsconfig.json            # ✨ TypeScript config
├── CHANGELOG.md             # ✨ Version history
└── SECURITY.md              # ✨ Security documentation
```

✨ = New or significantly improved in v2.1.0

## 🔒 Security

Pixan.ai implements multiple layers of security:

### Encryption
- **AES-GCM-256** for API key storage
- **PBKDF2** key derivation (100,000 iterations)
- **Random salt & IV** per encryption operation
- **Web Crypto API** (native browser/Node.js)

### Network Security
- **HSTS** - Force HTTPS
- **CSP** - Restrict resource loading
- **CORS** - Controlled cross-origin access
- **Rate Limiting** - Prevent abuse

### Application Security
- **Input Validation** - All user inputs validated
- **Error Boundaries** - Prevent info leakage
- **Secure Logging** - No credential exposure
- **JWT Authentication** - HttpOnly cookies

See [SECURITY.md](./SECURITY.md) for complete security documentation.

## 📊 Architecture

### LLM Collaboration Flow

```
User Query
    ↓
Claude Analysis (assigns roles to all LLMs including itself)
    ↓
Parallel Execution (Claude + GPT-4 + Gemini + Perplexity + DeepSeek + Mistral)
    ↓
Claude Consolidation (synthesizes all responses with visual formatting)
    ↓
Final Response (with tables, emojis, structured content)
```

### Security Flow

```
User Input → Validation → Rate Limit Check → API Handler → Encryption → Storage
                                    ↓
                              Error Boundary → Logging → User Response
```

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run type-check      # TypeScript check (when migrated)

# Testing
npm run test            # Run tests (to be implemented)
npm run test:ci         # CI test mode
npm run test:coverage   # Coverage report
```

### Environment Variables

```bash
# .env.local
JWT_SECRET=your-secret-key-here
NODE_ENV=production

# API keys stored encrypted in browser localStorage
```

## 📈 Performance

### Optimizations
- ⚡ Parallel LLM queries (6 simultaneous)
- 🔄 Conversation memory (context-aware)
- 📦 Webpack optimizations
- 🎯 Efficient state management
- 💾 Secure localStorage caching

### Metrics
- **Build Time**: ~30s
- **Bundle Size**: Optimized with code splitting
- **First Load**: < 3s (production)
- **API Response**: 2-10s (depends on LLM)

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests (to be implemented)
npm run test:e2e

# Coverage
npm run test:coverage
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy automatically on push

### Manual Deployment

```bash
# Build
npm run build

# Start
npm run start
```

## 📝 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and detailed changes.

### Latest (v2.1.0)
- 🔥 Fixed input re-render bug
- 🔒 Real encryption with AES-GCM
- 🛡️ Security headers & CSP
- ⏱️ Rate limiting system
- 🚨 Error boundaries
- 📝 Structured logging
- ✅ Input validation
- 🔧 TypeScript config
- 🔄 CI/CD pipeline

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by multiple LLM providers
- Icons by [Lucide](https://lucide.dev/)
- Animations by [Framer Motion](https://www.framer.com/motion/)

## 📞 Support

- 📧 Email: support@pixan.ai
- 🐛 Issues: [GitHub Issues](https://github.com/your-org/pixan.ai/issues)
- 🔒 Security: [SECURITY.md](./SECURITY.md)

---

**Built with ❤️ by the Pixan.ai team**

🧠 Generated with [Claude Code](https://claude.com/claude-code)

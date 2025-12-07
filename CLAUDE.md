# Pixan.ai - Collaborative GenAI Platform

## Project Overview
Pixan.ai is a collaborative generative AI platform that orchestrates multiple LLMs to provide comprehensive, multi-perspective responses. Built with Next.js 14 and React 18.

## Tech Stack
- **Framework**: Next.js 14 with React 18
- **Styling**: TailwindCSS 3.3, CSS-in-JS (styled-jsx)
- **Storage**: Vercel KV (@vercel/kv)
- **Authentication**: JWT (jsonwebtoken), bcryptjs
- **UI**: Framer Motion, Lucide React, React Icons
- **Testing**: Jest 29, React Testing Library

## Integrated LLMs
The platform integrates 7 LLM providers:
- **Claude Sonnet 4.5** (Anthropic) - 200K context
- **GPT-5.1 Think** (OpenAI) - 400K context
- **Gemini 3 Pro** (Google) - 1M context
- **Sonar Pro** (Perplexity) - 200K context, web search
- **DeepSeek v3.2** - 164K context
- **Grok 4.1** (xAI) - 2M context
- **Kimi K2** (Moonshot) - 262K context

## Project Structure
```
/pages
  /api          - API routes for each LLM provider
  genAI.js      - Main collaborative AI interface
  llmC.js       - Chat interface with client-side API keys
  index.js      - Landing page
/components     - Reusable React components
/contexts       - React contexts (LanguageContext for i18n)
/lib            - Utilities (crypto, validation, storage, rate-limiter)
/__tests__      - Jest test files
```

## Key Commands
```bash
npm run dev       # Start development server
npm run build     # Production build
npm run test      # Run tests in watch mode
npm run test:ci   # Run tests for CI
npm run lint      # Run ESLint
```

## Recent Work
- Implementation of client-side API keys for LLM Colaborativa
- Perplexity model updated to Sonar Pro
- Error handling improvements for DeepSeek and Mistral
- localStorage for persistent API key storage
- API key validation to accept all valid formats
- Default language set to English (removed browser auto-detection)
- Image generation modes: Schema, Infographic, Realistic (photography)

## Configuration Notes
- Default language: English (contexts/LanguageContext.js)
- API keys stored in localStorage (client-side) or Vercel KV (server-side)
- Image generation uses different prompts per mode type

## API Endpoints
- `/api/chat.js` - Main chat orchestration
- `/api/claude-chat.js` - Claude API proxy
- `/api/openai-chat.js` - OpenAI API proxy
- `/api/gemini-chat.js` - Gemini API proxy
- `/api/perplexity-chat.js` - Perplexity API proxy
- `/api/deepseek-chat.js` - DeepSeek API proxy
- `/api/mistral-chat.js` - Mistral API proxy
- `/api/generate.js` - Image generation
- `/api/admin/*` - Admin panel endpoints

## Deployment
Deployed on Vercel with Edge Functions support.

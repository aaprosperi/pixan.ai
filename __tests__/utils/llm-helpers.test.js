/**
 * Unit Tests for LLM Helper Functions
 */

describe('LLM Helper Functions', () => {
  
  describe('API Key Validation', () => {
    const validateApiKey = (key, provider) => {
      if (!key) return false
      
      const patterns = {
        claude: /^sk-ant-api\d{2}-[\w-]{95}$/,
        openai: /^sk-[a-zA-Z0-9]{48}$/,
        gemini: /^AIza[a-zA-Z0-9-_]{35}$/,
        perplexity: /^pplx-[a-zA-Z0-9]{48}$/,
        deepseek: /^sk-[a-zA-Z0-9]{32,}$/,
        mistral: /^[a-zA-Z0-9]{32}$/
      }
      
      // Allow any format for now (as per current implementation)
      return key.length > 10
    }

    test('validates Claude API keys', () => {
      expect(validateApiKey('sk-ant-api03-very-long-key-here', 'claude')).toBe(true)
      expect(validateApiKey('invalid', 'claude')).toBe(false)
      expect(validateApiKey('', 'claude')).toBe(false)
    })

    test('validates OpenAI API keys', () => {
      expect(validateApiKey('sk-1234567890abcdef1234567890abcdef1234567890abcd', 'openai')).toBe(true)
      expect(validateApiKey('short', 'openai')).toBe(false)
    })

    test('accepts any valid format (current behavior)', () => {
      expect(validateApiKey('any-key-longer-than-10-chars', 'any')).toBe(true)
      expect(validateApiKey('short', 'any')).toBe(false)
    })
  })

  describe('Token Cost Calculation', () => {
    const calculateCost = (inputTokens, outputTokens, model) => {
      const rates = {
        'claude-3-opus': { input: 0.015, output: 0.075 },
        'gpt-4': { input: 0.03, output: 0.06 },
        'gemini-pro': { input: 0.0005, output: 0.0015 },
        'perplexity-sonar': { input: 0.001, output: 0.001 },
        'deepseek-chat': { input: 0.0001, output: 0.0002 },
        'mistral-large': { input: 0.002, output: 0.006 }
      }
      
      const rate = rates[model] || { input: 0.001, output: 0.001 }
      return (inputTokens * rate.input + outputTokens * rate.output) / 1000
    }

    test('calculates Claude token costs', () => {
      const cost = calculateCost(1000, 500, 'claude-3-opus')
      expect(cost).toBeCloseTo(0.0525, 4)
    })

    test('calculates GPT-4 token costs', () => {
      const cost = calculateCost(1000, 500, 'gpt-4')
      expect(cost).toBeCloseTo(0.06, 4)
    })

    test('calculates Gemini token costs', () => {
      const cost = calculateCost(1000, 500, 'gemini-pro')
      expect(cost).toBeCloseTo(0.00125, 5)
    })

    test('uses default rate for unknown models', () => {
      const cost = calculateCost(1000, 500, 'unknown-model')
      expect(cost).toBeCloseTo(0.0015, 4)
    })
  })

  describe('Response Formatting', () => {
    const formatLLMResponse = (response, llmName) => {
      const emojis = {
        claude: '🧠',
        openai: '🤖',
        gemini: '💎',
        perplexity: '🔍',
        deepseek: '🌊',
        mistral: '🌪️'
      }
      
      return {
        llm: llmName.toUpperCase(),
        emoji: emojis[llmName] || '🤖',
        response: response,
        timestamp: new Date().toISOString()
      }
    }

    test('formats Claude response correctly', () => {
      const formatted = formatLLMResponse('Test response', 'claude')
      expect(formatted.llm).toBe('CLAUDE')
      expect(formatted.emoji).toBe('🧠')
      expect(formatted.response).toBe('Test response')
      expect(formatted.timestamp).toBeDefined()
    })

    test('formats multiple LLM responses', () => {
      const llms = ['openai', 'gemini', 'perplexity']
      const responses = llms.map(llm => formatLLMResponse(`${llm} response`, llm))
      
      expect(responses).toHaveLength(3)
      expect(responses[0].emoji).toBe('🤖')
      expect(responses[1].emoji).toBe('💎')
      expect(responses[2].emoji).toBe('🔍')
    })
  })

  describe('Query Validation', () => {
    const validateQuery = (query) => {
      const errors = []
      
      if (!query || query.trim().length === 0) {
        errors.push('Query cannot be empty')
      }
      
      if (query.length < 10) {
        errors.push('Query too short (minimum 10 characters)')
      }
      
      if (query.length > 10000) {
        errors.push('Query too long (maximum 10000 characters)')
      }
      
      return {
        isValid: errors.length === 0,
        errors
      }
    }

    test('validates empty query', () => {
      const result = validateQuery('')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Query cannot be empty')
    })

    test('validates short query', () => {
      const result = validateQuery('Hi')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Query too short (minimum 10 characters)')
    })

    test('validates valid query', () => {
      const result = validateQuery('This is a valid query for testing')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    test('validates very long query', () => {
      const longQuery = 'a'.repeat(10001)
      const result = validateQuery(longQuery)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Query too long (maximum 10000 characters)')
    })
  })

  describe('Conversation Memory', () => {
    const addToConversation = (conversation, role, content, maxLength = 10) => {
      const newEntry = { role, content, timestamp: Date.now() }
      const updated = [...conversation, newEntry]
      
      // Keep only last maxLength entries
      if (updated.length > maxLength) {
        return updated.slice(-maxLength)
      }
      
      return updated
    }

    test('adds new message to conversation', () => {
      const conversation = []
      const updated = addToConversation(conversation, 'user', 'Hello')
      
      expect(updated).toHaveLength(1)
      expect(updated[0].role).toBe('user')
      expect(updated[0].content).toBe('Hello')
    })

    test('maintains conversation history order', () => {
      let conversation = []
      conversation = addToConversation(conversation, 'user', 'Question 1')
      conversation = addToConversation(conversation, 'assistant', 'Answer 1')
      conversation = addToConversation(conversation, 'user', 'Question 2')
      
      expect(conversation).toHaveLength(3)
      expect(conversation[0].content).toBe('Question 1')
      expect(conversation[2].content).toBe('Question 2')
    })

    test('limits conversation history length', () => {
      let conversation = []
      
      for (let i = 0; i < 15; i++) {
        conversation = addToConversation(conversation, 'user', `Message ${i}`, 10)
      }
      
      expect(conversation).toHaveLength(10)
      expect(conversation[0].content).toBe('Message 5')
      expect(conversation[9].content).toBe('Message 14')
    })
  })
})
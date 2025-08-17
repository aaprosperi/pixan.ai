/**
 * Integration Tests for LLM APIs
 * These tests verify the API calls and response handling
 */

describe('LLM API Integration Tests', () => {
  const mockPassword = 'pixan'
  const mockApiKey = 'sk-test-key-12345'

  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('Claude API', () => {
    test('successfully calls Claude API with correct parameters', async () => {
      const mockResponse = {
        response: 'Claude test response',
        usage: {
          inputTokens: 100,
          outputTokens: 50,
          cost: 0.001,
          remainingBalance: 99.999
        }
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      const response = await fetch('/api/claude-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-password': mockPassword
        },
        body: JSON.stringify({
          message: 'Test message',
          context: 'general_query',
          password: mockPassword,
          apiKey: mockApiKey
        })
      })

      const data = await response.json()

      expect(global.fetch).toHaveBeenCalledWith('/api/claude-chat', expect.any(Object))
      expect(data.response).toBe('Claude test response')
      expect(data.usage.inputTokens).toBe(100)
    })

    test('handles Claude API errors correctly', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'API rate limit exceeded' })
      })

      const response = await fetch('/api/claude-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-password': mockPassword
        },
        body: JSON.stringify({
          message: 'Test message',
          context: 'general_query',
          password: mockPassword
        })
      })

      const data = await response.json()

      expect(response.ok).toBe(false)
      expect(data.error).toBe('API rate limit exceeded')
    })
  })

  describe('OpenAI API', () => {
    test('successfully calls OpenAI API', async () => {
      const mockResponse = {
        response: 'GPT-4 test response',
        usage: {
          inputTokens: 80,
          outputTokens: 40,
          cost: 0.0008,
          remainingBalance: 99.9992
        }
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      const response = await fetch('/api/openai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-password': mockPassword
        },
        body: JSON.stringify({
          message: 'Test message',
          conversation: [],
          password: mockPassword,
          apiKey: mockApiKey
        })
      })

      const data = await response.json()

      expect(data.response).toBe('GPT-4 test response')
      expect(data.usage).toBeDefined()
    })
  })

  describe('Gemini API', () => {
    test('successfully calls Gemini API', async () => {
      const mockResponse = {
        response: 'Gemini test response',
        usage: {
          inputTokens: 90,
          outputTokens: 45,
          cost: 0.0009,
          remainingBalance: 99.9991
        }
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      const response = await fetch('/api/gemini-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-password': mockPassword
        },
        body: JSON.stringify({
          prompt: 'Test prompt',
          parameters: { temperature: 0.7 },
          password: mockPassword,
          apiKey: mockApiKey
        })
      })

      const data = await response.json()

      expect(data.response).toBe('Gemini test response')
    })
  })

  describe('Perplexity API', () => {
    test('successfully calls Perplexity API', async () => {
      const mockResponse = {
        response: 'Perplexity search response with sources',
        usage: {
          inputTokens: 70,
          outputTokens: 60,
          cost: 0.0007,
          remainingBalance: 99.9993
        }
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      const response = await fetch('/api/perplexity-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-password': mockPassword
        },
        body: JSON.stringify({
          message: 'Search query',
          conversation: [],
          password: mockPassword,
          apiKey: mockApiKey
        })
      })

      const data = await response.json()

      expect(data.response).toContain('Perplexity search response')
    })
  })

  describe('Parallel API Calls', () => {
    test('handles multiple LLM calls in parallel', async () => {
      const mockResponses = [
        { ok: true, json: async () => ({ response: 'Claude response', usage: {} }) },
        { ok: true, json: async () => ({ response: 'OpenAI response', usage: {} }) },
        { ok: true, json: async () => ({ response: 'Gemini response', usage: {} }) },
        { ok: true, json: async () => ({ response: 'Perplexity response', usage: {} }) }
      ]

      mockResponses.forEach(mockResponse => {
        global.fetch.mockResolvedValueOnce(mockResponse)
      })

      const apiCalls = [
        fetch('/api/claude-chat', { method: 'POST', body: JSON.stringify({}) }),
        fetch('/api/openai-chat', { method: 'POST', body: JSON.stringify({}) }),
        fetch('/api/gemini-chat', { method: 'POST', body: JSON.stringify({}) }),
        fetch('/api/perplexity-chat', { method: 'POST', body: JSON.stringify({}) })
      ]

      const responses = await Promise.all(apiCalls)
      const data = await Promise.all(responses.map(r => r.json()))

      expect(data).toHaveLength(4)
      expect(data[0].response).toBe('Claude response')
      expect(data[1].response).toBe('OpenAI response')
      expect(data[2].response).toBe('Gemini response')
      expect(data[3].response).toBe('Perplexity response')
    })

    test('handles partial failures in parallel calls', async () => {
      global.fetch
        .mockResolvedValueOnce({ ok: true, json: async () => ({ response: 'Success 1' }) })
        .mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'API Error' }) })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ response: 'Success 2' }) })

      const apiCalls = [
        fetch('/api/claude-chat', { method: 'POST', body: JSON.stringify({}) }),
        fetch('/api/openai-chat', { method: 'POST', body: JSON.stringify({}) }),
        fetch('/api/gemini-chat', { method: 'POST', body: JSON.stringify({}) })
      ]

      const responses = await Promise.allSettled(apiCalls)
      
      expect(responses[0].status).toBe('fulfilled')
      expect(responses[1].status).toBe('fulfilled')
      expect(responses[2].status).toBe('fulfilled')
      
      const secondResponse = await responses[1].value.json()
      expect(secondResponse.error).toBe('API Error')
    })
  })

  describe('Token Stats API', () => {
    test('fetches token statistics successfully', async () => {
      const mockStats = {
        claude: { usage: { input: 1000, output: 500, cost: 0.01 }, balance: 99.99 },
        openai: { usage: { input: 800, output: 400, cost: 0.008 }, balance: 99.992 },
        gemini: { usage: { input: 900, output: 450, cost: 0.009 }, balance: 99.991 },
        perplexity: { usage: { input: 700, output: 600, cost: 0.007 }, balance: 99.993 }
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStats
      })

      const response = await fetch('/api/token-stats/', {
        headers: {
          'x-auth-password': mockPassword
        }
      })

      const data = await response.json()

      expect(data.claude.balance).toBe(99.99)
      expect(data.openai.usage.input).toBe(800)
      expect(Object.keys(data)).toContain('gemini')
      expect(Object.keys(data)).toContain('perplexity')
    })
  })
})
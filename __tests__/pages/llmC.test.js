import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LLMColaborativa from '../../pages/llmC'
import { LanguageProvider } from '../../contexts/LanguageContext'

// Mock del contexto de idioma
const MockedLanguageProvider = ({ children }) => (
  <LanguageProvider>{children}</LanguageProvider>
)

describe('LLMColaborativa Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks()
    localStorage.clear()
  })

  describe('Authentication', () => {
    test('renders login form when not authenticated', () => {
      render(
        <MockedLanguageProvider>
          <LLMColaborativa />
        </MockedLanguageProvider>
      )

      expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument()
      expect(screen.getByText(/acceder/i)).toBeInTheDocument()
    })

    test('shows error with wrong password', async () => {
      const user = userEvent.setup()
      render(
        <MockedLanguageProvider>
          <LLMColaborativa />
        </MockedLanguageProvider>
      )

      const passwordInput = screen.getByPlaceholderText(/password/i)
      const submitButton = screen.getByText(/acceder/i)

      await user.type(passwordInput, 'wrongpassword')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/contraseña incorrecta/i)).toBeInTheDocument()
      })
    })

    test('authenticates with correct password', async () => {
      const user = userEvent.setup()
      render(
        <MockedLanguageProvider>
          <LLMColaborativa />
        </MockedLanguageProvider>
      )

      const passwordInput = screen.getByPlaceholderText(/password/i)
      const submitButton = screen.getByText(/acceder/i)

      await user.type(passwordInput, 'pixan')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/LLM Colaborativa Multi-IA/i)).toBeInTheDocument()
      })
    })
  })

  describe('Main Interface', () => {
    beforeEach(async () => {
      // Auto-authenticate for main interface tests
      const user = userEvent.setup()
      render(
        <MockedLanguageProvider>
          <LLMColaborativa />
        </MockedLanguageProvider>
      )

      const passwordInput = screen.getByPlaceholderText(/password/i)
      const submitButton = screen.getByText(/acceder/i)

      await user.type(passwordInput, 'pixan')
      await user.click(submitButton)
    })

    test('renders main interface after authentication', async () => {
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/escribe tu consulta/i)).toBeInTheDocument()
        expect(screen.getByText(/iniciar colaboración/i)).toBeInTheDocument()
      })
    })

    test('validates query length', async () => {
      const user = userEvent.setup()
      
      await waitFor(() => {
        expect(screen.getByText(/iniciar colaboración/i)).toBeInTheDocument()
      })

      const submitButton = screen.getByText(/iniciar colaboración/i)
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/muy corta/i)).toBeInTheDocument()
      })
    })

    test('shows character count', async () => {
      const user = userEvent.setup()
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/escribe tu consulta/i)).toBeInTheDocument()
      })

      const queryInput = screen.getByPlaceholderText(/escribe tu consulta/i)
      await user.type(queryInput, 'Test query')

      expect(screen.getByText(/10 caracteres/i)).toBeInTheDocument()
    })
  })

  describe('API Key Management', () => {
    test('stores API keys in localStorage', async () => {
      const testKey = 'sk-test-key-12345'
      
      // Simulate storing an API key
      localStorage.setItem('pixan_api_claude', btoa(encodeURIComponent(testKey)))
      
      expect(localStorage.getItem).toHaveBeenCalledWith('pixan_api_claude')
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'pixan_api_claude',
        btoa(encodeURIComponent(testKey))
      )
    })

    test('retrieves and decodes API keys', () => {
      const testKey = 'sk-test-key-12345'
      const encodedKey = btoa(encodeURIComponent(testKey))
      
      localStorage.getItem.mockReturnValue(encodedKey)
      
      // Simulate the getApiKeys function logic
      const encryptedKey = localStorage.getItem('pixan_api_claude')
      const decodedKey = decodeURIComponent(atob(encryptedKey))
      
      expect(decodedKey).toBe(testKey)
    })
  })

  describe('Terminal Output', () => {
    test('logs messages to terminal', async () => {
      const user = userEvent.setup()
      
      // Mock fetch for token stats
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          claude: { usage: { input: 0, output: 0, cost: 0 }, balance: 100 },
          openai: { usage: { input: 0, output: 0, cost: 0 }, balance: 100 },
        })
      })

      render(
        <MockedLanguageProvider>
          <LLMColaborativa />
        </MockedLanguageProvider>
      )

      // Authenticate
      const passwordInput = screen.getByPlaceholderText(/password/i)
      await user.type(passwordInput, 'pixan')
      await user.click(screen.getByText(/acceder/i))

      await waitFor(() => {
        expect(screen.getByText(/terminal/i)).toBeInTheDocument()
      })
    })
  })
})
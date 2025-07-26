import { PRICING, INITIAL_BALANCES } from './api-config';

// Estado global de consumo y saldos (en producción esto sería una DB)
let tokenUsage = {
  claude: { input: 0, output: 0, cost: 0 },
  openai: { input: 0, output: 0, cost: 0 },
  gemini: { input: 0, output: 0, cost: 0 },
  perplexity: { input: 0, output: 0, cost: 0 },
  inflection: { input: 0, output: 0, cost: 0 },
  mistral: { input: 0, output: 0, cost: 0 }
};

let currentBalances = { ...INITIAL_BALANCES };

// Función para estimar tokens (aproximación)
export function estimateTokens(text) {
  if (!text) return 0;
  // Aproximación: ~4 caracteres por token en promedio
  return Math.ceil(text.length / 4);
}

// Función para actualizar uso de tokens
export function updateTokenUsage(provider, inputText, outputText) {
  if (!tokenUsage[provider]) return;
  
  const inputTokens = estimateTokens(inputText);
  const outputTokens = estimateTokens(outputText);
  
  const inputCost = inputTokens * PRICING[provider].input;
  const outputCost = outputTokens * PRICING[provider].output;
  const totalCost = inputCost + outputCost;
  
  // Actualizar uso
  tokenUsage[provider].input += inputTokens;
  tokenUsage[provider].output += outputTokens;
  tokenUsage[provider].cost += totalCost;
  
  // Actualizar saldo
  currentBalances[provider] -= totalCost;
  
  return {
    inputTokens,
    outputTokens,
    cost: totalCost,
    remainingBalance: currentBalances[provider]
  };
}

// Función para obtener estadísticas actuales
export function getTokenStats() {
  const stats = {};
  
  Object.keys(tokenUsage).forEach(provider => {
    stats[provider] = {
      usage: { ...tokenUsage[provider] },
      balance: currentBalances[provider],
      pricing: PRICING[provider]
    };
  });
  
  return stats;
}

// Función para resetear estadísticas (útil para testing)
export function resetTokenStats() {
  tokenUsage = {
    claude: { input: 0, output: 0, cost: 0 },
    openai: { input: 0, output: 0, cost: 0 },
    gemini: { input: 0, output: 0, cost: 0 },
    perplexity: { input: 0, output: 0, cost: 0 },
    inflection: { input: 0, output: 0, cost: 0 },
    mistral: { input: 0, output: 0, cost: 0 }
  };
  currentBalances = { ...INITIAL_BALANCES };
}

// Función para verificar si hay saldo suficiente
export function hasBalance(provider, estimatedCost = 0) {
  return currentBalances[provider] > estimatedCost;
}
// Configuración segura de APIs con ofuscación
const crypto = require('crypto');

// Función para desofuscar las APIs
const deobfuscate = (encoded) => {
  if (!encoded) return '';
  try {
    return Buffer.from(encoded, 'base64').toString('utf-8');
  } catch {
    return '';
  }
};

// APIs desde variables de entorno (pueden estar ofuscadas o directas)
const API_KEYS = {
  claude: process.env.CLAUDE_API_KEY_ENCODED ? deobfuscate(process.env.CLAUDE_API_KEY_ENCODED) : process.env.CLAUDE_API_KEY || '',
  openai: process.env.OPENAI_API_KEY_ENCODED ? deobfuscate(process.env.OPENAI_API_KEY_ENCODED) : process.env.OPENAI_API_KEY || '',
  gemini: process.env.GEMINI_API_KEY_ENCODED ? deobfuscate(process.env.GEMINI_API_KEY_ENCODED) : process.env.GEMINI_API_KEY || '',
  perplexity: process.env.PERPLEXITY_API_KEY_ENCODED ? deobfuscate(process.env.PERPLEXITY_API_KEY_ENCODED) : process.env.PERPLEXITY_API_KEY || '',
  deepseek: process.env.DEEPSEEK_API_KEY_ENCODED ? deobfuscate(process.env.DEEPSEEK_API_KEY_ENCODED) : process.env.DEEPSEEK_API_KEY || '',
  mistral: process.env.MISTRAL_API_KEY_ENCODED ? deobfuscate(process.env.MISTRAL_API_KEY_ENCODED) : process.env.MISTRAL_API_KEY || ''
};

// Configuración de precios por token (en USD) - Actualizado Diciembre 2025
const PRICING = {
  claude: {
    input: 0.003 / 1000,  // $3 por millón de tokens de entrada
    output: 0.015 / 1000, // $15 por millón de tokens de salida
    model: 'claude-sonnet-4-5-20250929'  // Actualizado a Claude Sonnet 4.5
  },
  openai: {
    input: 0.002 / 1000,   // $2 por millón de tokens de entrada (reducido de $10)
    output: 0.008 / 1000,  // $8 por millón de tokens de salida (reducido de $30)
    model: 'gpt-4.1'  // Actualizado a GPT-4.1 (mejor performance, menor costo)
  },
  gemini: {
    input: 0.0001 / 1000,  // $0.10 por millón de tokens de entrada
    output: 0.0004 / 1000, // $0.40 por millón de tokens de salida
    model: 'gemini-2.0-flash'  // Actualizado a Gemini 2.0 Flash
  },
  perplexity: {
    input: 0.002 / 1000,  // $2 por millón de tokens de entrada
    output: 0.002 / 1000, // $2 por millón de tokens de salida
    model: 'sonar-pro'  // Ya actualizado con Llama 3.3 70B
  },
  deepseek: {
    input: 0.00028 / 1000,  // $0.28 por millón de tokens de entrada (cache miss)
    output: 0.00042 / 1000, // $0.42 por millón de tokens de salida
    model: 'deepseek-chat'  // Actualizado a V3.2 (usa endpoint deepseek-chat)
  },
  mistral: {
    input: 0.0005 / 1000,   // $0.50 por millón de tokens de entrada (reducido de $1)
    output: 0.0015 / 1000,  // $1.50 por millón de tokens de salida (reducido de $3)
    model: 'mistral-large-3'  // Actualizado a Mistral Large 3 (41B active, 675B total params)
  }
};

// Saldos iniciales (en USD) - estos deben venir de una base de datos
const INITIAL_BALANCES = {
  claude: parseFloat(process.env.CLAUDE_BALANCE || '100'),
  openai: parseFloat(process.env.OPENAI_BALANCE || '100'),
  gemini: parseFloat(process.env.GEMINI_BALANCE || '100'),
  perplexity: parseFloat(process.env.PERPLEXITY_BALANCE || '100'),
  deepseek: parseFloat(process.env.DEEPSEEK_BALANCE || '100'),
  mistral: parseFloat(process.env.MISTRAL_BALANCE || '100')
};

// Password desde variable de entorno (puede estar ofuscado o directo)
const AUTH_PASSWORD = process.env.AUTH_PASSWORD_ENCODED ? deobfuscate(process.env.AUTH_PASSWORD_ENCODED) : process.env.AUTH_PASSWORD || 'Pixan01.';

module.exports = {
  API_KEYS,
  PRICING,
  INITIAL_BALANCES,
  AUTH_PASSWORD,
  deobfuscate
};
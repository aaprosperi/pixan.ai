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

// Configuración de precios por token (en USD)
const PRICING = {
  claude: {
    input: 0.003 / 1000,  // $3 por millón de tokens de entrada
    output: 0.015 / 1000, // $15 por millón de tokens de salida
    model: 'claude-3-5-sonnet-20241022'
  },
  openai: {
    input: 0.01 / 1000,   // $10 por millón de tokens de entrada
    output: 0.03 / 1000,  // $30 por millón de tokens de salida
    model: 'gpt-4'
  },
  gemini: {
    input: 0.00025 / 1000,  // $0.25 por millón de tokens de entrada
    output: 0.00125 / 1000, // $1.25 por millón de tokens de salida
    model: 'gemini-2.5-flash'
  },
  perplexity: {
    input: 0.002 / 1000,  // $2 por millón de tokens de entrada
    output: 0.002 / 1000, // $2 por millón de tokens de salida
    model: 'sonar-pro'
  },
  deepseek: {
    input: 0.0001 / 1000,  // $0.10 por millón de tokens de entrada
    output: 0.0002 / 1000, // $0.20 por millón de tokens de salida
    model: 'deepseek-chat'
  },
  mistral: {
    input: 0.001 / 1000,   // $1 por millón de tokens de entrada
    output: 0.003 / 1000,  // $3 por millón de tokens de salida
    model: 'mistral-large-2'
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
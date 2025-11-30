/**
 * Validation Library
 * Provides schema-based validation for API requests and forms
 */

/**
 * Validation Error
 */
export class ValidationError extends Error {
  constructor(message, errors = {}) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

/**
 * Validators
 */
export const validators = {
  string: (value, options = {}) => {
    if (typeof value !== 'string') {
      return { valid: false, error: 'Must be a string' };
    }

    if (options.min && value.length < options.min) {
      return { valid: false, error: `Must be at least ${options.min} characters` };
    }

    if (options.max && value.length > options.max) {
      return { valid: false, error: `Must be at most ${options.max} characters` };
    }

    if (options.pattern && !options.pattern.test(value)) {
      return { valid: false, error: options.patternError || 'Invalid format' };
    }

    if (options.email && !isValidEmail(value)) {
      return { valid: false, error: 'Invalid email address' };
    }

    if (options.url && !isValidURL(value)) {
      return { valid: false, error: 'Invalid URL' };
    }

    return { valid: true, value };
  },

  number: (value, options = {}) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;

    if (typeof num !== 'number' || isNaN(num)) {
      return { valid: false, error: 'Must be a number' };
    }

    if (options.min !== undefined && num < options.min) {
      return { valid: false, error: `Must be at least ${options.min}` };
    }

    if (options.max !== undefined && num > options.max) {
      return { valid: false, error: `Must be at most ${options.max}` };
    }

    if (options.integer && !Number.isInteger(num)) {
      return { valid: false, error: 'Must be an integer' };
    }

    return { valid: true, value: num };
  },

  boolean: (value) => {
    if (typeof value === 'boolean') {
      return { valid: true, value };
    }

    if (value === 'true') return { valid: true, value: true };
    if (value === 'false') return { valid: true, value: false };

    return { valid: false, error: 'Must be a boolean' };
  },

  array: (value, options = {}) => {
    if (!Array.isArray(value)) {
      return { valid: false, error: 'Must be an array' };
    }

    if (options.min && value.length < options.min) {
      return { valid: false, error: `Must have at least ${options.min} items` };
    }

    if (options.max && value.length > options.max) {
      return { valid: false, error: `Must have at most ${options.max} items` };
    }

    return { valid: true, value };
  },

  object: (value) => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return { valid: false, error: 'Must be an object' };
    }

    return { valid: true, value };
  },

  enum: (value, options = {}) => {
    if (!options.values || !Array.isArray(options.values)) {
      throw new Error('enum validator requires "values" option');
    }

    if (!options.values.includes(value)) {
      return {
        valid: false,
        error: `Must be one of: ${options.values.join(', ')}`
      };
    }

    return { valid: true, value };
  },

  apiKey: (value) => {
    if (typeof value !== 'string') {
      return { valid: false, error: 'API key must be a string' };
    }

    if (value.length < 10) {
      return { valid: false, error: 'API key is too short' };
    }

    // Basic format validation for common API key patterns
    const patterns = {
      claude: /^sk-ant-/,
      openai: /^sk-/,
      gemini: /^AI/
    };

    // At least check it looks like some kind of API key
    if (!/^[A-Za-z0-9_\-]+$/.test(value.substring(0, 20))) {
      return { valid: false, error: 'Invalid API key format' };
    }

    return { valid: true, value };
  }
};

/**
 * Helper functions
 */
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Schema validator
 */
export function createSchema(schema) {
  return {
    validate(data, options = {}) {
      const errors = {};
      const validated = {};

      for (const [key, rules] of Object.entries(schema)) {
        const value = data[key];

        // Check required
        if (rules.required && (value === undefined || value === null || value === '')) {
          errors[key] = 'This field is required';
          continue;
        }

        // Skip validation if optional and not provided
        if (!rules.required && (value === undefined || value === null)) {
          continue;
        }

        // Apply validator
        if (rules.type) {
          const validator = validators[rules.type];
          if (!validator) {
            throw new Error(`Unknown validator type: ${rules.type}`);
          }

          const result = validator(value, rules);
          if (!result.valid) {
            errors[key] = result.error;
          } else {
            validated[key] = result.value;
          }
        }

        // Custom validator
        if (rules.custom) {
          const result = rules.custom(value, data);
          if (result !== true) {
            errors[key] = result || 'Validation failed';
          }
        }
      }

      if (Object.keys(errors).length > 0) {
        if (options.throw !== false) {
          throw new ValidationError('Validation failed', errors);
        }
        return { valid: false, errors };
      }

      return { valid: true, data: validated };
    },

    parse(data) {
      const result = this.validate(data, { throw: true });
      return result.data;
    },

    safeParse(data) {
      try {
        const result = this.validate(data, { throw: false });
        if (result.valid) {
          return { success: true, data: result.data };
        }
        return { success: false, error: result.errors };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  };
}

/**
 * Common Schemas
 */

export const authSchema = createSchema({
  password: {
    type: 'string',
    required: true,
    min: 3,
    max: 100
  }
});

export const apiKeySchema = createSchema({
  provider: {
    type: 'enum',
    required: true,
    values: ['claude', 'openai', 'gemini', 'perplexity', 'deepseek', 'mistral']
  },
  key: {
    type: 'apiKey',
    required: true
  }
});

export const llmQuerySchema = createSchema({
  message: {
    type: 'string',
    required: true,
    min: 1,
    max: 50000
  },
  context: {
    type: 'string',
    required: false
  },
  temperature: {
    type: 'number',
    required: false,
    min: 0,
    max: 2
  }
});

export const promptBoostSchema = createSchema({
  prompt: {
    type: 'string',
    required: true,
    min: 10,
    max: 10000
  },
  llm: {
    type: 'string',
    required: false
  },
  industry: {
    type: 'string',
    required: false
  },
  temp: {
    type: 'number',
    required: false,
    min: 0,
    max: 10
  }
});

export default {
  validators,
  createSchema,
  ValidationError,
  authSchema,
  apiKeySchema,
  llmQuerySchema,
  promptBoostSchema
};

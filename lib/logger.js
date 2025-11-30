/**
 * Structured Logging System
 * Provides consistent logging across the application
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  FATAL: 4
};

const LOG_LEVEL_NAMES = {
  0: 'DEBUG',
  1: 'INFO',
  2: 'WARN',
  3: 'ERROR',
  4: 'FATAL'
};

class Logger {
  constructor(options = {}) {
    this.minLevel = options.minLevel || (process.env.NODE_ENV === 'production' ? LOG_LEVELS.INFO : LOG_LEVELS.DEBUG);
    this.context = options.context || {};
    this.transports = options.transports || [this.consoleTransport];
  }

  /**
   * Create a structured log entry
   */
  createLogEntry(level, message, meta = {}) {
    return {
      timestamp: new Date().toISOString(),
      level: LOG_LEVEL_NAMES[level],
      message,
      ...this.context,
      ...meta,
      environment: process.env.NODE_ENV || 'development',
      ...(typeof window !== 'undefined' && {
        userAgent: window.navigator.userAgent,
        url: window.location.href
      })
    };
  }

  /**
   * Console transport
   */
  consoleTransport(entry) {
    const { level, message, timestamp, ...meta } = entry;
    const color = {
      DEBUG: '\x1b[36m',  // Cyan
      INFO: '\x1b[32m',   // Green
      WARN: '\x1b[33m',   // Yellow
      ERROR: '\x1b[31m',  // Red
      FATAL: '\x1b[35m'   // Magenta
    }[level] || '';
    const reset = '\x1b[0m';

    if (typeof window !== 'undefined') {
      // Browser console
      const styles = {
        DEBUG: 'color: cyan',
        INFO: 'color: green',
        WARN: 'color: orange',
        ERROR: 'color: red',
        FATAL: 'color: magenta'
      };

      console.log(
        `%c[${level}] ${timestamp} - ${message}`,
        styles[level],
        Object.keys(meta).length > 0 ? meta : ''
      );
    } else {
      // Node.js console
      console.log(`${color}[${level}]${reset} ${timestamp} - ${message}`, Object.keys(meta).length > 0 ? meta : '');
    }
  }

  /**
   * Log a message
   */
  log(level, message, meta = {}) {
    if (level < this.minLevel) return;

    const entry = this.createLogEntry(level, message, meta);

    // Send to all transports
    this.transports.forEach(transport => {
      try {
        transport(entry);
      } catch (error) {
        console.error('Transport error:', error);
      }
    });

    return entry;
  }

  /**
   * Debug level log
   */
  debug(message, meta = {}) {
    return this.log(LOG_LEVELS.DEBUG, message, meta);
  }

  /**
   * Info level log
   */
  info(message, meta = {}) {
    return this.log(LOG_LEVELS.INFO, message, meta);
  }

  /**
   * Warning level log
   */
  warn(message, meta = {}) {
    return this.log(LOG_LEVELS.WARN, message, meta);
  }

  /**
   * Error level log
   */
  error(message, meta = {}) {
    // If meta is an Error object, extract its properties
    if (meta instanceof Error) {
      meta = {
        error: meta.message,
        stack: meta.stack,
        name: meta.name
      };
    }
    return this.log(LOG_LEVELS.ERROR, message, meta);
  }

  /**
   * Fatal level log
   */
  fatal(message, meta = {}) {
    if (meta instanceof Error) {
      meta = {
        error: meta.message,
        stack: meta.stack,
        name: meta.name
      };
    }
    return this.log(LOG_LEVELS.FATAL, message, meta);
  }

  /**
   * Create a child logger with additional context
   */
  child(context = {}) {
    return new Logger({
      minLevel: this.minLevel,
      context: { ...this.context, ...context },
      transports: this.transports
    });
  }

  /**
   * Add a custom transport
   */
  addTransport(transport) {
    this.transports.push(transport);
  }

  /**
   * Remove a transport
   */
  removeTransport(transport) {
    const index = this.transports.indexOf(transport);
    if (index > -1) {
      this.transports.splice(index, 1);
    }
  }
}

/**
 * HTTP Transport - sends logs to remote endpoint
 */
export function createHttpTransport(endpoint, options = {}) {
  return async (entry) => {
    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: JSON.stringify(entry)
      });
    } catch (error) {
      console.error('HTTP transport error:', error);
    }
  };
}

/**
 * localStorage Transport - stores logs in browser storage
 */
export function createLocalStorageTransport(maxEntries = 100) {
  const KEY = 'pixan_logs';

  return (entry) => {
    try {
      const logs = JSON.parse(localStorage.getItem(KEY) || '[]');
      logs.push(entry);

      // Keep only last maxEntries
      if (logs.length > maxEntries) {
        logs.splice(0, logs.length - maxEntries);
      }

      localStorage.setItem(KEY, JSON.stringify(logs));
    } catch (error) {
      console.error('localStorage transport error:', error);
    }
  };
}

/**
 * Get logs from localStorage
 */
export function getStoredLogs() {
  try {
    return JSON.parse(localStorage.getItem('pixan_logs') || '[]');
  } catch {
    return [];
  }
}

/**
 * Clear logs from localStorage
 */
export function clearStoredLogs() {
  try {
    localStorage.removeItem('pixan_logs');
  } catch (error) {
    console.error('Error clearing logs:', error);
  }
}

// Create default logger instance
const logger = new Logger({
  context: {
    application: 'pixan.ai',
    version: '2.0.0'
  }
});

// Add localStorage transport in browser
if (typeof window !== 'undefined') {
  logger.addTransport(createLocalStorageTransport(50));
}

// Setup global error handler
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    logger.error('Uncaught error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error?.stack
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    logger.error('Unhandled promise rejection', {
      reason: event.reason?.toString(),
      promise: event.promise?.toString()
    });
  });

  // Expose logger to window for debugging
  window.logErrorToService = (error, errorInfo) => {
    logger.error('React Error Boundary', {
      error: error?.toString(),
      stack: error?.stack,
      componentStack: errorInfo?.componentStack
    });
  };
}

export { Logger, LOG_LEVELS };
export default logger;

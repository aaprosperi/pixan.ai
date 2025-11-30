/**
 * Secure Storage Library using Web Crypto API
 * Provides real encryption for sensitive data in browser storage
 */

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const ITERATIONS = 100000;

/**
 * Derive a cryptographic key from a password using PBKDF2
 * @param {string} password - User password
 * @param {Uint8Array} salt - Cryptographic salt
 * @returns {Promise<CryptoKey>} Derived key
 */
async function deriveKey(password, salt) {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  const baseKey = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: ITERATIONS,
      hash: 'SHA-256'
    },
    baseKey,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt data using AES-GCM
 * @param {string} data - Plain text data to encrypt
 * @param {string} password - Encryption password
 * @returns {Promise<string>} Base64 encoded encrypted data with salt and IV
 */
export async function encryptData(data, password) {
  try {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);

    // Generate random salt and IV
    const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

    // Derive encryption key
    const key = await deriveKey(password, salt);

    // Encrypt data
    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: ALGORITHM,
        iv: iv
      },
      key,
      dataBuffer
    );

    // Combine salt + iv + encrypted data
    const encryptedArray = new Uint8Array(encryptedBuffer);
    const combined = new Uint8Array(salt.length + iv.length + encryptedArray.length);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(encryptedArray, salt.length + iv.length);

    // Convert to base64 for storage
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypt data using AES-GCM
 * @param {string} encryptedData - Base64 encoded encrypted data
 * @param {string} password - Decryption password
 * @returns {Promise<string>} Decrypted plain text
 */
export async function decryptData(encryptedData, password) {
  try {
    // Decode from base64
    const combined = new Uint8Array(
      atob(encryptedData).split('').map(c => c.charCodeAt(0))
    );

    // Extract salt, iv, and encrypted data
    const salt = combined.slice(0, SALT_LENGTH);
    const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const data = combined.slice(SALT_LENGTH + IV_LENGTH);

    // Derive decryption key
    const key = await deriveKey(password, salt);

    // Decrypt data
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv: iv
      },
      key,
      data
    );

    // Convert to string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data - invalid password or corrupted data');
  }
}

/**
 * Store encrypted data in localStorage
 * @param {string} key - Storage key
 * @param {string} data - Data to encrypt and store
 * @param {string} password - Encryption password
 */
export async function secureSetItem(key, data, password) {
  const encrypted = await encryptData(data, password);
  localStorage.setItem(key, encrypted);
}

/**
 * Retrieve and decrypt data from localStorage
 * @param {string} key - Storage key
 * @param {string} password - Decryption password
 * @returns {Promise<string|null>} Decrypted data or null if not found
 */
export async function secureGetItem(key, password) {
  const encrypted = localStorage.getItem(key);
  if (!encrypted) return null;

  try {
    return await decryptData(encrypted, password);
  } catch (error) {
    console.error('Failed to decrypt item:', key);
    return null;
  }
}

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 */
export function secureRemoveItem(key) {
  localStorage.removeItem(key);
}

/**
 * Generate a secure random password
 * @param {number} length - Password length
 * @returns {string} Random password
 */
export function generateSecurePassword(length = 32) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  const randomValues = crypto.getRandomValues(new Uint8Array(length));
  let password = '';

  for (let i = 0; i < length; i++) {
    password += charset[randomValues[i] % charset.length];
  }

  return password;
}

/**
 * Validate if crypto API is available
 * @returns {boolean} True if crypto API is available
 */
export function isCryptoAvailable() {
  return typeof crypto !== 'undefined' &&
         typeof crypto.subtle !== 'undefined' &&
         typeof crypto.getRandomValues !== 'undefined';
}

// Export default object with all functions
export default {
  encryptData,
  decryptData,
  secureSetItem,
  secureGetItem,
  secureRemoveItem,
  generateSecurePassword,
  isCryptoAvailable
};

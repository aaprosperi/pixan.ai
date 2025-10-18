// Vercel KV wrapper with fallback to in-memory storage
// This allows the app to work both with and without KV configured

let kvClient = null;
let memoryStorage = new Map();

// Try to import Vercel KV
try {
  const { kv } = require('@vercel/kv');
  kvClient = kv;
  console.log('Vercel KV initialized successfully');
} catch (error) {
  console.log('Vercel KV not available, using in-memory storage');
}

// Wrapper functions that work with both KV and memory
export const storage = {
  async get(key) {
    if (kvClient) {
      try {
        return await kvClient.get(key);
      } catch (error) {
        console.error('KV get error:', error);
        return null;
      }
    }
    return memoryStorage.get(key) || null;
  },

  async set(key, value) {
    if (kvClient) {
      try {
        await kvClient.set(key, value);
        return true;
      } catch (error) {
        console.error('KV set error:', error);
        return false;
      }
    }
    memoryStorage.set(key, value);
    return true;
  },

  async del(key) {
    if (kvClient) {
      try {
        await kvClient.del(key);
        return true;
      } catch (error) {
        console.error('KV del error:', error);
        return false;
      }
    }
    memoryStorage.delete(key);
    return true;
  },

  async keys(pattern) {
    if (kvClient) {
      try {
        return await kvClient.keys(pattern);
      } catch (error) {
        console.error('KV keys error:', error);
        return [];
      }
    }
    // Simple pattern matching for memory storage
    const allKeys = Array.from(memoryStorage.keys());
    if (pattern === '*') return allKeys;
    const regex = new RegExp(pattern.replace('*', '.*'));
    return allKeys.filter(key => regex.test(key));
  },

  isKVAvailable() {
    return kvClient !== null;
  }
};
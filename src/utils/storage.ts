// src/utils/storage.ts
import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'user-storage',
  // encryptionKey: 'your-secure-key', // Uncomment and set a strong key for encryption
});

// Function to log all MMKV data - USE FOR DEBUGGING ONLY
export const logAllStorageData = () => {
  console.log('--- MMKV Storage Data ---');
  const keys = storage.getAllKeys(); // Returns string[]

  if (keys.length === 0) {
    console.log('No data found in MMKV storage.');
    console.log('--- End MMKV Storage Data ---');
    return;
  }

  keys.forEach((key) => {
    let value: string | number | boolean | undefined;

    // Try to fetch value based on its type
    value = storage.getString(key);
    if (value === undefined) {
      value = storage.getNumber(key);
    }
    if (value === undefined) {
      value = storage.getBoolean(key);
    }

    // Attempt to parse as JSON if it looks like a stringified object/array
    let displayValue: any = value;
    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);
            // Only use parsed value if it's an object or array, otherwise keep original string
            if (typeof parsed === 'object' && parsed !== null) {
                displayValue = parsed;
            }
        } catch (e) {
            // Not JSON, keep as string
        }
    }
    
    console.log(`MMKV Data: ${key} =>`, displayValue);
  });
  console.log('--- End MMKV Storage Data ---');
};

// --- IMPORTANT: DO NOT CALL logAllStorageData() GLOBALLY HERE ---
// Call logAllStorageData() explicitly where needed for debugging,
// e.g., in a useEffect hook in a dev-only screen, or triggered by a button.


// You might also want to add helper functions for saving/getting objects
// to handle JSON.stringify/parse automatically.
export function saveObject<T>(key: string, value: T): void {
  storage.set(key, JSON.stringify(value));
}

export function getObject<T>(key: string): T | undefined {
  const storedValue = storage.getString(key);
  if (storedValue) {
    try {
      return JSON.parse(storedValue) as T;
    } catch (e) {
      console.error(`Error parsing JSON for key '${key}':`, e);
      return undefined;
    }
  }
  return undefined;
}

export function clearAllStorage(): void {
    storage.clearAll();
    console.log('MMKV storage cleared.');
}
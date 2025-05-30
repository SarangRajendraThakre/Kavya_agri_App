import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'user-storage',
  // encryptionKey: 'your-secure-key',
});

// Function to log all MMKV data
export const logAllStorageData = () => {
  const keys = storage.getAllKeys(); // Returns string[]
  
  keys.forEach((key) => {
    let value: string | number | boolean | undefined;

    // Try to fetch value based on its type
    value = storage.getString(key);
    if (value === undefined) value = storage.getNumber(key);
    if (value === undefined) value = storage.getBoolean(key);

    console.log(`MMKV Data: ${key} =>`, value);
  });
};

// Usage: Call this anywhere in your app
logAllStorageData();
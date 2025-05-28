// src/utils/storage.ts
import { MMKV } from 'react-native-mmkv';

// You can create multiple instances if needed, with different IDs or encryption keys.
// For user-specific data, consider using an encryption key.
export const storage = new MMKV({
  id: 'user-storage', // A unique ID for this storage instance
  // encryptionKey: 'your-secure-encryption-key', // RECOMMENDED: Use a strong, securely generated key.
});

// Example of how to use it:
// storage.set('userToken', 'some_jwt_token');
// const userToken = storage.getString('userToken'); // 'some_jwt_token'

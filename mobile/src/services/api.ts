import ky from 'ky';
import * as SecureStore from 'expo-secure-store';
 
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const api = ky.create({
  prefixUrl: API_URL,
  headers: {
    'Accept': 'application/json',
  },
  hooks: {
    beforeRequest: [
      async (request) => {
        const token = await SecureStore.getItemAsync('auth_token');
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
  },
});
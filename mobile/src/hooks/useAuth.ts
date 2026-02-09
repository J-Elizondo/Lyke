import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api } from '../services/api';
import { router } from 'expo-router';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    checkInitialAuth();
  }, []);

  async function checkInitialAuth() {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        // Verify token with Laravel
        const response: any = await api.get('user').json();
        setUser(response);
      }
    } catch (error) {
      // If token is invalid or expired, clear it
      await logout();
    } finally {
      setLoading(false);
    }
  }

  async function login(token: string, userData: any) {
    await SecureStore.setItemAsync('auth_token', token);
    setUser(userData);
    router.replace('/(tabs)'); // Redirect to main app
  }

  async function logout() {
    try {
      await api.post('logout');
    } catch (e) {
      // Silent fail if already expired
    } finally {
        await SecureStore.deleteItemAsync('auth_token');
        setUser(null);
        router.replace('/(auth)'); // Redirect to landing
    }
  }

  return { user, isLoading, login, logout };
}
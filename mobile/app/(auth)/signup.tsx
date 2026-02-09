import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { api } from '@/src/services/api';
import { useAuth } from '@/src/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function SignupScreen() {
  const { t } = useTranslation();
  const { login } = useAuth();
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    const { name, email, password, password_confirmation } = form;

    if (!name || !email || !password || !password_confirmation) {
      return Alert.alert(t('auth.error'), 'Please fill in all fields');
    }

    setLoading(true);
    try {
      const response: any = await api.post('v1/register', {
        json: form
      }).json();

      if (response.status === 'success') {
        // Automatically log them in after registration
        await login(response.data.token, response.data.user);
      }
    } catch (error: any) {
      const errorData = await error.response?.json();
      const message = errorData?.errors 
        ? Object.values(errorData.errors)[0] 
        : 'Registration failed';
      Alert.alert('Error', message as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-slate-950">
      <View className="px-8 pt-20 pb-10">
        <View className="mb-10">
          <Text className="text-4xl font-bold text-slate-900 dark:text-white">
            {t('auth.signUp')}
          </Text>
          <Text className="text-slate-500 dark:text-slate-400 mt-2">
            Join Lyke and start matching.
          </Text>
        </View>

        <View>
          <Input
            placeholder="Full Name"
            value={form.name}
            onChangeText={(text) => setForm({ ...form, name: text })}
          />
          <Input
            placeholder={t('auth.email')}
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Input
            placeholder={t('auth.password')}
            value={form.password}
            onChangeText={(text) => setForm({ ...form, password: text })}
            secureTextEntry
          />
          <Input
            placeholder="Confirm Password"
            value={form.password_confirmation}
            onChangeText={(text) => setForm({ ...form, password_confirmation: text })}
            secureTextEntry
          />

          <View className="mt-4">
            <Button 
              title={t('auth.signUp')} 
              onPress={handleSignup} 
              loading={loading} 
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
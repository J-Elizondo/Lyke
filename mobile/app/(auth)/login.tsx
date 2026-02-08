import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, Modal, 
  FlatList, KeyboardAvoidingView, Platform, Keyboard 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, withTiming, FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

// Mock Country Data
const COUNTRIES = [
  { code: 'US', dial_code: '+1', name: 'United States' },
  { code: 'CA', dial_code: '+1', name: 'Canada' },
  { code: 'MX', dial_code: '+52', name: 'Mexico' },
  { code: 'GB', dial_code: '+44', name: 'United Kingdom' },
];

export default function PhoneInputScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [modalVisible, setModalVisible] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const { t } = useTranslation();

  // Focus the input on mount to bring up keyboard immediately
  const inputRef = React.useRef<TextInput>(null);

  useEffect(() => {
    // Small delay to ensure UI is ready before keyboard pops
    const timeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  const isValid = phoneNumber.length > 0;

  // Animated Style for the Floating Action Button
  const buttonStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(isValid ? '#4f46e5' : '#e2e8f0'),
      opacity: withTiming(isValid ? 1 : 0.5),
    };
  });

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-950">
      
      {/* 1. Header with X Link */}
      <View className="px-6 pt-2 pb-4 flex-row justify-end">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="close" size={28} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      {/* 2. Main Content */}
      <View className="px-8 mt-4">
        <Text className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
          {t("auth.what_is_your_phone_number")}
        </Text>

        <View className="flex-row items-center space-x-4 mb-4">
          {/* Country Code Selector */}
          <TouchableOpacity 
            onPress={() => setModalVisible(true)}
            className="border-b-2 border-slate-200 pb-2 flex-row items-center"
          >
            <Text className="text-xl font-semibold text-slate-900 dark:text-white mr-2">
              {countryCode}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#94a3b8" />
          </TouchableOpacity>

          {/* Phone Input */}
          <TextInput
            ref={inputRef}
            className="flex-1 text-xl font-semibold text-slate-900 dark:text-white border-b-2 border-slate-200 pb-2"
            placeholder=""
            placeholderTextColor="#cbd5e1"
            keyboardType="number-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            autoFocus={true} // Keeps keyboard open
          />
        </View>

        <Text className="text-slate-400 text-xs leading-5">
          We will send you a text with a verification code. Message and data rates may apply.
        </Text>
      </View>

      {/* 3. Floating Action Button (Attached to Keyboard view) */}
      <KeyboardAvoidingView 
        behavior="padding"
        className="flex-1 justify-end px-8 pb-4"
        keyboardVerticalOffset={10}
      >
        <View className="items-end mb-4">
          <Animated.View style={buttonStyle} className="rounded-full w-14 h-14 items-center justify-center overflow-hidden">
            <TouchableOpacity 
              disabled={!isValid}
              onPress={() => {
                router.push({
                  pathname: '/(auth)/verify',
                  params: { phone: `${countryCode}${phoneNumber}` }
                });
              }}
              className="w-full h-full items-center justify-center"
            >
              <Ionicons 
                name="chevron-forward" 
                size={28} 
                color={isValid ? 'white' : '#94a3b8'} 
              />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>

      {/* 4. Country Selection Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-white dark:bg-slate-950 px-6 pt-6">
          <View className="flex-row items-center mb-6">
            <TouchableOpacity onPress={() => setModalVisible(false)} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="#0f172a" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-slate-900 dark:text-white">
              {t("auth.select_country")}
            </Text>
          </View>

          <FlatList
            data={COUNTRIES}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity 
                className="py-4 border-b border-slate-100 flex-row justify-between items-center"
                onPress={() => {
                  setCountryCode(item.dial_code);
                  setModalVisible(false);
                }}
              >
                <Text className="text-lg text-slate-900 dark:text-white">
                  {item.name} ({item.code})
                </Text>
                <Text className="text-slate-500 font-medium">{item.dial_code}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}
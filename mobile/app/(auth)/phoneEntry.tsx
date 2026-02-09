import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Modal,
  FlatList, Platform
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AppText } from "@/components/ui/Text";
import { QuestionScreenShell } from "@/components/shell/QuestionScreenShell";
import Colors from "@/constants/Colors";

export default function PhoneEntryScreen() {
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryModalVisibility, setCountryModalVisible] = useState(false);
  const { method } = useLocalSearchParams();
  const { t } = useTranslation();

  const inputRef = React.useRef<TextInput>(null);

  useEffect(() => {
    // Small delay to ensure UI is ready before keyboard pops
    const timeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  // Mock Country Data
  const CountriesData = [
    { code: 'US', dial_code: '+1', name: t("country.united_states") },
    { code: 'CA', dial_code: '+1', name: t("country.canada") },
  ];

  return (
    <QuestionScreenShell
      title={t("auth.what_is_your_phone_number")}
      canProceed={phoneNumber.length > 0}
      nextHref={{
        pathname: "/(auth)/verifyOtp",
        params: {
          phone: `${countryCode}${phoneNumber}`,
          method: method
        }
      }}
    >
      <View className="flex-row items-center mb-4">
        {/* Country Code Selector */}
        <TouchableOpacity
          onPress={() => setCountryModalVisible(true)}
          className="flex-row items-center border-b-2 border-slate-200 mr-8"
        >
          <Text className="text-4xl font-semibold text-slate-900 dark:text-white mr-2 pb-1.5">
            {countryCode}
          </Text>
          <Ionicons name="chevron-down" size={16} color={Colors.slateGray} />
        </TouchableOpacity>

        {/* Phone Input */}
        <TextInput
          ref={inputRef}
          className='flex-1 text-4xl pb-1 font-semibold text-slate-900 dark:text-white border-b-2 border-slate-200'
          keyboardType='number-pad'
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          autoFocus={true} // Keeps keyboard open
        />
      </View>

      <AppText className="text-sm leading-5">{t("auth.verification_text_disclaimer")}</AppText>

      <Modal
        animationType="slide"
        transparent={false}
        visible={countryModalVisibility}
        presentationStyle="pageSheet"
        onRequestClose={() => setCountryModalVisible(false)}
      >
        <View className="flex-1 bg-white dark:bg-slate-950 px-6 pt-6">
          <View className="flex-row items-center mb-6">
            <TouchableOpacity onPress={() => setCountryModalVisible(false)} className="mr-4">
              <Ionicons
                name="arrow-back"
                size={24}
                color={Colors.slateGray}
              />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-slate-900 dark:text-white">
              {t("auth.select_country")}
            </Text>
          </View>

          <FlatList
            data={CountriesData}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="py-4 border-b border-slate-400 flex-row justify-between items-center"
                onPress={() => {
                  setCountryCode(item.dial_code);
                  setCountryModalVisible(false);
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
    </QuestionScreenShell>
  );
}
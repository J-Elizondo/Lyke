import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, TextInput,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { QuestionScreenShell } from "@/components/shell/QuestionScreenShell";

export default function VerifyOtpScreen() {
  const { phone } = useLocalSearchParams();
  const [code, setCode] = useState('');
  const [isCodeInvalid, setIsCodeInvalid] = useState(false);
  const [timer, setTimer] = useState(60); // 1. Start at 60 seconds
  const inputRef = useRef<TextInput>(null);
  const { t } = useTranslation();

  // Handle the countdown timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Focus the hidden input on mount
  useEffect(() => {
    const timeout = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timeout);
  }, []);

  const handleVerify = async (text: string) => {
    setCode(text);
    if (text.length === 6) {
      if (text === '000000') {
        setIsCodeInvalid(false);
      } else {
        setIsCodeInvalid(true);
      }
    }
  };

  const handleResend = () => {
    if (timer > 0) return;

    // todo: Logic to hit Laravel v1/resend-otp
    console.log("Resending code...");
    setTimer(60);
  };

  const isResendDisabled = timer > 0;

  return (
    <QuestionScreenShell
      title={t("auth.enter_your_code")}
      subtitle={t("auth.sent_to", { phone: phone })}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => inputRef.current?.focus()}
        className="flex-row justify-between mb-8"
      >
        {[...Array(6)].map((_, i) => (
          <View
            key={i}
            className={`w-12 h-16 border-b-4 items-center justify-center ${
              code.length === i ? 'border-indigo-600' : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <Text className="text-3xl font-bold text-slate-900 dark:text-white">
              {code[i] || ""}
            </Text>
          </View>
        ))}
      </TouchableOpacity>

      <TextInput
        ref={inputRef}
        value={code}
        onChangeText={handleVerify}
        maxLength={6}
        keyboardType='number-pad'
        className='absolute opacity-0'
        textContentType='oneTimeCode'
      />

      {isCodeInvalid && code.length === 6 && (
        <Text className="text-red-600 mb-2">{t("auth.invalid_otp")}</Text>
      )}

      <TouchableOpacity
        className='mt-4'
        onPress={handleResend}
        disabled={isResendDisabled}
      >
        <Text
          className={`font-bold ${
            isResendDisabled
              ? 'text-slate-400 dark:text-slate-600'
              : 'text-indigo-600'
          }`}
        >
          {t("auth.resend_code")}
          {isResendDisabled && ` (${timer}s)`}
        </Text>
      </TouchableOpacity>
    </QuestionScreenShell>
  );
}
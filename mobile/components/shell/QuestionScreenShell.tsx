import React from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Href } from 'expo-router';
import { CircularChevron } from '../ui/CircularChevron';

interface QuestionShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  canProceed?: boolean; // Defaulting to false below
  nextHref?: Href;
  onNext?: () => void;
}

export const QuestionScreenShell = ({
                                      title,
                                      subtitle,
                                      children,
                                      canProceed = false, // Defaults to false
                                      nextHref,
                                      onNext
                                    }: QuestionShellProps) => {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-950">
      {/* Header */}
      <View className="px-6 pt-2 pb-4 flex-row justify-end">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="close" size={28} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="px-8 mt-4 flex-1">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {title}
          </Text>
          {subtitle && <Text className="text-slate-500">{subtitle}</Text>}
        </View>

        {children}
      </View>

      {/* Proceed */}
      {nextHref && (
        <KeyboardAvoidingView
          behavior='padding'
          className='flex-1 px-8 pb-4'
          keyboardVerticalOffset={10}
        >
          <View className="items-end mb-4">
            <CircularChevron
              canProceed={canProceed}
              href={nextHref}
              onPress={onNext}
            />
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};
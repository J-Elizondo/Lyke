import React from 'react';
import { TextInput, TextInputProps, View, Text } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, ...props }: InputProps) => {
  return (
    <View className="w-full mb-4">
      {label && (
        <Text className="text-slate-700 dark:text-slate-300 font-medium mb-1 ml-1">
          {label}
        </Text>
      )}
      
      <TextInput
        // Use a conditional placeholder color for better contrast
        placeholderTextColor="#94a3b8" 
        
        // bg-slate-100 (Light) vs bg-slate-800 (Dark)
        // text-slate-900 (Light) vs text-white (Dark)
        className={`w-full p-4 rounded-2xl bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white ${
          error ? 'border-2 border-red-500' : ''
        }`}
        
        {...props}
      />
      
      {error && <Text className="text-red-500 text-sm mt-1 ml-1">{error}</Text>}
    </View>
  );
};
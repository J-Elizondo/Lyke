import React from 'react';
import { TextProps, Text } from 'react-native';

interface Props extends TextProps {
  className?: string
}

export const AppText = ({ children, className, ...props }: Props) => {
  const mergedClassNames = className + " text-slate-400";
  return (
    <Text className={mergedClassNames} >
      {children}
    </Text>
  );
};
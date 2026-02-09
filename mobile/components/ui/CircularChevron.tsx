import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import Colors from "@/constants/Colors";

interface Props {
  canProceed: boolean;
  href: Href;
  onPress?: () => void;
}

export const CircularChevron = ({ canProceed, href, onPress }: Props) => {
  const router = useRouter();

  const buttonStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(canProceed ? Colors.button.primary : Colors.button.disabled),
      opacity: withTiming(canProceed ? 1 : 0.5),
    };
  });

  const handlePress = () => {
    if (!canProceed) return;

    onPress?.();
    router.push(href);
  };

  return (
    <Animated.View
      style={buttonStyle}
      className="rounded-full w-14 h-14 overflow-hidden"
    >
      <TouchableOpacity
        disabled={!canProceed}
        onPress={handlePress}
        className="w-full h-full items-center justify-center"
        activeOpacity={0.7}
      >
        <Ionicons
          name="chevron-forward"
          size={28}
          color={canProceed ? 'white' : Colors.slateGray}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeOutDown, LinearTransition } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useVideoPlayer, VideoView } from 'expo-video';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';

const videoSource = 'https://lorem.video/1280x720_h264_20s_30fps';

export default function LandingScreen() {
  const [showSocials, setShowSocials] = useState(false);
  const { t } = useTranslation();

  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  return (
    <View className="flex-1 bg-black">
      {/* Background Video */}
      <VideoView
        player={player}
        style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}
        contentFit="cover"
        nativeControls={false}
      />

      {/* Dark Overlay - ensures text readability */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.9)']}
        style={StyleSheet.absoluteFill}
      />

      {/* Top Content (Brand) */}
      <View className="absolute top-52 left-0 right-0 items-center">
        <Text className="text-white text-6xl font-bold tracking-tighter">
          {t('auth.welcome')}
        </Text>
        <Text className="text-white text-lg opacity-80 font-medium">
          {t('auth.subtitle')}
        </Text>
      </View>

      {/* Bottom Content (Actions) */}
      <Animated.View 
        layout={LinearTransition}
        className="absolute bottom-16 left-0 right-0 px-8"
      >
        {/* Disclaimer Section */}
        <Text className="text-white/60 text-center text-xs mb-8 leading-5 px-4">
          By tapping 'Sign in' / 'Create account', you agree to our{' '}
          <Text className="underline text-white/80">Terms of Service</Text>. 
          Learn how we process your data in our{' '}
          <Text className="underline text-white/80">Privacy Policy</Text> and{' '}
          <Text className="underline text-white/80">Cookies Policy</Text>.
        </Text>

        <View className="space-y-4">
          {!showSocials ? (
            <Animated.View 
              entering={FadeInDown.duration(400)} 
              exiting={FadeOutDown.duration(200)}
              className="gap-y-4"
            >
              <Button 
                title={t('auth.sign_up')} 
                onPress={() =>
                  router.push({
                    pathname: '/(auth)/phoneEntry',
                    params: {
                      method: 'signup'
                    }
                  })
                }
              />
              
              <TouchableOpacity 
                onPress={() => setShowSocials(true)}
                className="w-full p-4 items-center"
              >
                <Text className="text-white font-semibold text-lg">
                  {t('auth.sign_in')}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <Animated.View 
              entering={FadeInDown.springify().damping(15)} 
              exiting={FadeOutDown}
              className="gap-y-3"
            >
              <TouchableOpacity className="bg-white p-4 rounded-2xl flex-row justify-center items-center">
                <Ionicons name="logo-apple" size={20} color="black" />
                <Text className="text-black font-semibold ml-2">{t("auth.sign_in_with_apple")}</Text>
              </TouchableOpacity>

              <TouchableOpacity className="bg-white p-4 rounded-2xl flex-row justify-center items-center">
                <Ionicons name="logo-google" size={20} color="black" />
                <Text className="text-black font-semibold ml-2">{t("auth.sign_in_with_google")}</Text>
              </TouchableOpacity>

              <Button title={t("auth.sign_in_with_phone")} onPress={() => {
                router.push({
                  pathname: '/(auth)/phoneEntry',
                  params: {
                    method: 'login'
                  }
                })
              }} />

              <TouchableOpacity 
                onPress={() => setShowSocials(false)}
                className="mt-4 p-2 items-center"
              >
                <Text className="text-white font-semibold text-lg">{t("auth.back")}</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </Animated.View>
    </View>
  );
}
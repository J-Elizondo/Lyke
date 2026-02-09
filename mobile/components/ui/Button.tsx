import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
}

export const Button = ({ onPress, title, loading, variant = 'primary' }: ButtonProps) => {
  const isPrimary = variant === 'primary';
  
  return (
    <TouchableOpacity 
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.7}
      className={`w-full p-4 rounded-2xl flex-row justify-center items-center ${
        isPrimary ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'
      } ${loading ? 'opacity-70' : ''}`}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? "white" : "#4f46e5"} />
      ) : (
        <Text className={`font-semibold text-lg ${
          isPrimary ? 'text-white' : 'text-slate-900 dark:text-white'
        }`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { MotiView } from 'moti';
import { useTranslation } from '@/contexts';

interface StatsCardProps {
  icon: any;
  label: string;
  value: number | string;
  filter: string;
  delay?: number;
}

const StatsCard = ({
  icon,
  label,
  value,
  filter,
  delay = 0,
}: StatsCardProps) => {
  const { translate } = useTranslation();

  const handlePress = () => {
    router.push({ pathname: '/list', params: { filter } });
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <MotiView
        from={{ opacity: 0, translateY: 50 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 500, delay }}
        className="flex-row items-center justify-between bg-white rounded-2xl p-4 shadow-sm"
      >
        <View className="flex-row items-center gap-x-4">
          <Image source={icon} className="w-10 h-10" />
          <View>
            <Text className="text-2xl font-semibold text-gray-800">
              {label}
            </Text>
            <Text className="text-lg text-gray-500">
              {translate('occurrences')}
            </Text>
          </View>
        </View>
        <Text className="text-4xl font-bold text-primary">{value}</Text>
      </MotiView>
    </TouchableOpacity>
  );
};

export default StatsCard;

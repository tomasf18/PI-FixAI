import { View, Text } from 'react-native';
import { useTranslation } from '@/contexts';

const statusSteps = ['pending', 'in_progress', 'resolved'] as const;
const statusColors = {
  pending: 'bg-red-500',
  in_progress: 'bg-yellow-400',
  resolved: 'bg-green-500',
};

const StatusStepper = ({ currentStatus }: { currentStatus: string }) => {
  const { translate } = useTranslation();
  const currentIndex = statusSteps.indexOf(currentStatus as any);

  return (
    <View className="w-7/12 self-center">
      <View className="flex-row justify-between">
        {statusSteps.map((step, index) => {
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;

          return (
            <View key={step} className="items-center">
              <View
                className={`w-6 h-6 rounded-full justify-center items-center
                  ${isActive ? statusColors[step] : 'bg-gray-300'}
                  ${isCompleted ? 'border-2 border-gray-500' : ''}
              `}
              >
                <Text
                  className={`text-xs font-bold ${
                    isActive ? 'text-white' : 'text-gray-600'
                  }`}
                >
                  {index + 1}
                </Text>
              </View>
              <Text
                className={`text-xs mt-1 text-center ${
                  isActive ? 'font-semibold text-black' : 'text-gray-400'
                }`}
              >
                {translate(step)}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default StatusStepper;

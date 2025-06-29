import { View, ActivityIndicator } from "react-native";
import { useLoading } from "@/contexts/LoadingContext";

const LoadingOverlay = () => {
  const isLoading = useLoading();

  if (!isLoading) return null;

  return (
    <View className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/60 z-50">
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
};

export default LoadingOverlay;

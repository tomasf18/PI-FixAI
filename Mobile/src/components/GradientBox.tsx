import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const GradientBox = ({
  positionStyles,
  colors,
}: {
  positionStyles: object;
  colors: [string, string, ...string[]];
}) => {
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.cornerGradient, positionStyles]}
    />
  );
};

export default GradientBox;

const styles = StyleSheet.create({
  cornerGradient: {
    position: 'absolute',
    width: 12,
    height: 26,
  },
});

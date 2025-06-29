import {
  TextInput,
  View,
  StyleSheet,
} from 'react-native';

import GradientBox from './GradientBox';
import { useTranslation } from '@/contexts/TranslationContext';
import { useEffect, useRef, useState } from 'react';

interface TextInputDescriptionProps {
  inputRef: React.RefObject<TextInput>;
  initialValue?: string;
  onChange: (text: string) => void;
}

const TextInputDescription = ({
  inputRef,
  initialValue = '',
  onChange,
}: TextInputDescriptionProps) => {
  const { translate } = useTranslation();
  const [description, setDescription] = useState(initialValue);

  useEffect(() => {
    setDescription(initialValue);
  }, [initialValue]);

  const gradients: { positionStyles: any; colors: [string, string] }[] = [
    {
      positionStyles: styles.topLeft,
      colors: ['#FC3348', '#F6E05E'],
    },
    {
      positionStyles: styles.topRight,
      colors: ['#48BB78', '#4299E1'],
    },
    {
      positionStyles: styles.bottomLeft,
      colors: ['#A259FF', '#4299E1'],
    },
    {
      positionStyles: styles.bottomRight,
      colors: ['#F6E05E', '#48BB78'],
    },
  ];
  const [showInvisible, setShowInvisible] = useState(true);
  const invisibleRef = useRef<TextInput>(null); // Instead of useState with complex type
  return (
    <View className="relative">
      {showInvisible && (
        <TextInput
          ref={invisibleRef}
          multiline={true}
          editable={true}
          value={'\n'.repeat(50)}
          onFocus={() => {
            setShowInvisible(false); // Hide invisible input
            setTimeout(() => {
              inputRef.current?.focus(); // Focus the main input
            }, 0);
          }}
          className="absolute top-0 left-0 right-0 bg-red-500"
          style={{
            fontSize: 18,
            height: '100%',
            zIndex: 1,
            backgroundColor: 'transparent',
            left: -1000,
          }}
        />
      )}
      <TextInput
        ref={inputRef}
        placeholder={translate('description')}
        placeholderTextColor={'#A0AEC0'}
        multiline={true}
        value={description}
        onChangeText={(text) => {
          setDescription(text);
          onChange?.(text);
        }}
        onFocus={() => {
          setShowInvisible(false); // Hide invisible input when main input is focused
        }}
        onBlur={() => {
          // Optional: Show invisible input again when focus is lost
          setShowInvisible(true);
        }}
        className="border border-gray-400 rounded-2xl pt-3 pl-6 pr-6 bg-white text-gray-900 min-h-48 max-h-48"
        style={{ fontSize: 18 }}
      />
      {gradients.map((gradient, index) => (
        <GradientBox
          key={index}
          positionStyles={gradient.positionStyles}
          colors={gradient.colors}
        />
      ))}
    </View>
  );
};

export default TextInputDescription;

const styles = StyleSheet.create({
  topLeft: {
    top: 0,
    left: 0,
    borderTopLeftRadius: 14,
    borderBottomRightRadius: 8,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopRightRadius: 14,
    borderBottomLeftRadius: 8,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomLeftRadius: 14,
    borderTopRightRadius: 8,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomRightRadius: 14,
    borderTopLeftRadius: 8,
  },
});

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';

import { icons } from '@/constants';

interface FormFieldProps {
  title: string;
  value: string;
  handleChangeText: (text: string) => void;
  placeholder?: string;
  otherStyles?: string;
  textBoxStyles?: string;
  textStyles?: string;
  editable?: boolean;
  setRef: (ref: React.RefObject<TextInput | undefined>) => void;
  handleNextInput?: () => void;
  isLastInput?: boolean;
  onPress?: () => void;
  isPassword?: boolean;
}

const FormField = ({
  title,
  value,
  handleChangeText,
  placeholder,
  otherStyles,
  editable,
  textBoxStyles,
  textStyles,
  onPress,
  setRef = (ref) => {},
  isLastInput = false,
  handleNextInput = undefined,
  isPassword = false,
  ...other
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const myRef = useRef<TextInput>(null);

  useEffect(() => {
    setRef(myRef);
  }, [setRef]);

  // Function to focus the TextInput
  const handleFocus = () => {
    myRef.current?.focus();
  };

  return (
    <View className={`space-y-2 ${otherStyles}`} onTouchStart={handleFocus}>
      <Text className="text-base text-gray-500 font-pmedium">{title}</Text>

      <View
        className={`border border-gray-500 h-14 px-4 rounded-full items-center flex-row ${textBoxStyles}`}
      >
        <TextInput
          ref={myRef}
          className={`flex-1 font-pregular ${textStyles}`}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#888888"
          onChangeText={handleChangeText}
          secureTextEntry={isPassword && !showPassword}
          textContentType={isPassword ? 'password' : 'username'}
          editable={editable}
          onSubmitEditing={handleNextInput}
          onPress={onPress}
          returnKeyType={isLastInput ? 'done' : 'next'}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-10 h-10 p-1"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;

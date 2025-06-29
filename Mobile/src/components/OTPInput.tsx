import React from 'react';
import { View, Text } from 'react-native';
import {
  CodeField,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

const CELL_COUNT = 6;

interface OTPInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({ value, onChangeText }) => {
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue: onChangeText,
  });

  return (
    <View className="flex items-center">
      <View className="border-2 border-primary rounded-lg p-4 min-w-[200px] w-[300px]">
        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={onChangeText}
          cellCount={CELL_COUNT}
          rootStyle={{ flexDirection: 'row', justifyContent: 'space-between' }}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => (
            <Text
              key={index}
              style={{
                width: 40,
                height: 50,
                fontSize: 32,
                fontWeight: 'bold',
                textAlign: 'center',
                borderBottomWidth: 2,
                borderColor: isFocused ? 'black' : '#ccc',
              }}
              onLayout={getCellOnLayoutHandler(index)}
            >
              {symbol || (isFocused ? '|' : null)}
            </Text>
          )}
        />
      </View>
    </View>
  );
};

export default OTPInput;
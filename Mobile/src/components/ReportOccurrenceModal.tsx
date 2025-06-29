import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
} from 'react-native';
import { router } from 'expo-router';

import { getFormattedAddress } from '@/utils/geocode';
import { formatTime } from '@/utils/date';
import { icons, images } from '@/constants';
import CustomButton from './CustomButton';
import CategoryPickerModal from './CategoryPickerModal';
import TextInputDescription from './TextInputDescription';
import { useTranslation } from '@/contexts/TranslationContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  SubmitOccurrence,
  LocationCoords,
  PreSubmitOccurrenceResponse,
} from '@/api/dto/dto';
import ImageFromPhotoID from './ImageFromPhotoID';
import { useCountdownTimer, useReportOccurrence } from '@/hooks';
import { useGeneral } from '@/contexts';

interface PhotoModalProps {
  visible: boolean;
  onClose: () => void;
  locationCoords: LocationCoords | null;
  preSubmitResponse: PreSubmitOccurrenceResponse | null;
  llm_response: any | null;
  photoUri?: string | null;
}

const ReportOccurrenceModal = ({
  visible,
  onClose,
  locationCoords,
  preSubmitResponse,
  llm_response,
  photoUri,
}: PhotoModalProps) => {
  const { translate } = useTranslation();
  const { setPhotoUri } = useGeneral();
  const inputRef = useRef<TextInput>(null);
  const { axiosInstance } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [formattedAddress, setFormattedAddress] = useState<string | null>('');

  const timeLeft = useCountdownTimer({
    initialTime: preSubmitResponse?.max_time_to_submit || 0,
    onExpire: () => {
      onClose();
      router.replace('/photo');
      setPhotoUri(null);
    },
    alertTitle: translate('time_expired_title'),
    alertMessage: translate('time_expired_message'),
    alertConfirmText: translate('try_again'),
  });

  const { report } = useReportOccurrence(axiosInstance, onClose);


  // Check if suggestions are empty
  const isSuggestionsEmpty =
    !llm_response ||
    (llm_response.category === 'others' || llm_response.description === '');

  console.log('isSuggestionsEmpty:', isSuggestionsEmpty);

  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (photoUri) {
      fadeAnim.setValue(1);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 5000, // 5 seconds
        useNativeDriver: true,
      }).start();
    }
  }, [photoUri]);

  useEffect(() => {
    if (llm_response) {
      if (llm_response.category === "others" || llm_response.description === "") {
        console.log('Category is "others"');
        console.log('Description is empty');
        setSelectedCategory('');
        setDescription('');
      } else {
        console.log('Category:', llm_response.category);
        console.log('Description:', llm_response.description);
        setDescription(llm_response.description);
        setSelectedCategory(llm_response.category);
      }
    }
  }, [llm_response]);

  useEffect(() => {
    if (locationCoords) {
      getFormattedAddress(locationCoords).then(setFormattedAddress);
    }
  }, [locationCoords]);
  const handleSubmitOccurrence = async () => {
    console.log('SELECTED LOCATION:', locationCoords);
    setPhotoUri(null);
    const OccurrenceData: SubmitOccurrence = {
      incident_id: preSubmitResponse?.incident_id || '',
      photo_id: preSubmitResponse?.photo_id || '',
      category: selectedCategory || '',
      date: new Date().toISOString(),
      photo_latitude: locationCoords?.photo_latitude || 0,
      photo_longitude: locationCoords?.photo_longitude || 0,
      description: description,
      severity: llm_response.severity,
    };

    console.log('Submitting occurrence:', OccurrenceData);
    await report(OccurrenceData, selectedCategory, description);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView className="bg-white h-full">
        <View className="border-b border-b-gray-100 flex-row items-center justify-between px-7">
          <TouchableOpacity onPress={onClose}>
            <Image
              source={icons.back}
              resizeMode="contain"
              className="w-[30px] h-[54px]"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.push('/home');
              onClose();
            }}
          >
            <Image
              source={images.logo}
              className="w-[100px] h-[54px]"
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View className="w-[30px] h-[54px]"></View>
        </View>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={true}
        >
          <View className="w-full min-h-full px-4 mt-4">
            {preSubmitResponse?.photo_id && (
              <View className="w-full h-72 mb-6">
                {photoUri && (
                  <Animated.Image
                    source={{
                      uri: photoUri,
                    }}
                    className="w-full h-full absolute"
                    resizeMode="contain"
                    style={{ opacity: fadeAnim, zIndex: 1 }}
                  />
                )}

                <ImageFromPhotoID
                  photo_id={preSubmitResponse.photo_id}
                  type="small"
                  resizeMode="contain"
                />

                {/* Countdown Timer */
                <Text className="text-blue-600 text-lg font-semibold text-right mt-2">
                  {formatTime(timeLeft)}
                </Text>}
              </View>
            )}

            <View className="mt-4 border-t border-b border-gray-200 py-4">
              <View className="flex-row items-center mb-4">
                <Image
                  source={isSuggestionsEmpty ? icons.edit : icons.ai}
                  className="w-7 h-7 mr-2"
                  resizeMode="contain"
                />
                <Text className="text-blue-600 font-semibold text-xl">
                  {isSuggestionsEmpty
                    ? translate('description')
                    : translate('description_by_AI')}
                </Text>
              </View>
              <TextInputDescription
                inputRef={inputRef as React.RefObject<TextInput>}
                initialValue={description}
                onChange={setDescription}
              />
            </View>

            <View className="flex-row justify-between items-center border-b border-gray-200 py-4">
              <Text className="text-2xl font-semibold">
                {translate('category')}
              </Text>
              <TouchableOpacity
                className="border border-gray-300 p-3 rounded-lg"
                onPress={() => setCategoryModalVisible(true)}
              >
                <Text className="text-gray-700 text-lg">
                  {translate(selectedCategory) || translate('select_category')}
                </Text>
              </TouchableOpacity>
            </View>
            {/* <View className="border-t border-b border-gray-200 py-4">
              <Text className="text-2xl font-semibold">
                {translate('location')}
              </Text>
              <Text className="text-gray-600 text-lg">{formattedAddress}</Text>
            </View> */}
            <CustomButton
              title={translate('report_occurrence')}
              handlePress={handleSubmitOccurrence}
              containerStyles="mt-5 min-h-[53px]"
            />
          </View>
        </ScrollView>
        <CategoryPickerModal
          visible={categoryModalVisible}
          categories={preSubmitResponse?.allowed_categories || []}
          onSelectCategory={setSelectedCategory}
          onClose={() => setCategoryModalVisible(false)}
        />
      </SafeAreaView>
    </Modal>
  );
};

export default ReportOccurrenceModal;

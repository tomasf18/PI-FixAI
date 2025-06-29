import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { v1 as uuidv1 } from 'uuid';
import { useFocusEffect } from '@react-navigation/native';
import 'react-native-get-random-values';

import { CustomButton, OccurrenceCard } from '@/components';
import { useTranslation, useAuth, useSetLoading } from '@/contexts';
import { getUserOccurrences, OccurrenceListResponse } from '@/api';

const List = React.memo(() => {
  const { axiosInstance } = useAuth();
  const setLoading = useSetLoading();
  const { translate } = useTranslation();
  const params = useLocalSearchParams();

  const initialFilter = typeof params.filter === 'string' ? params.filter : 'pending';
  const [activeFilter, setActiveFilter] = useState<string>(initialFilter);
  const [occurrences, setOccurrences] = useState<OccurrenceListResponse[]>([]);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchOccurrences = async (maxTimeId: string) => {
    try {
      const response = await getUserOccurrences(
        axiosInstance,
        activeFilter,
        maxTimeId
      );
      console.log('User occurrences fetched successfully:', response);
      return response;
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.log('Unauthorized');
        router.replace('/sign-in');
      }
      console.log('Error fetching user occurrences:', error);
      return [];
    }
  };

  useEffect(() => {
    const filterToUse = typeof params.filter === 'string' ? params.filter : 'pending';
    setActiveFilter(filterToUse);
  }, [params.filter]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);

      const max_time_ud = uuidv1();

      fetchOccurrences(max_time_ud).then((data) => {
        setOccurrences(data);
        setHasMore(data.length > 0); // If there is data, probably there is more
        setLoading(false);
      });

      return () => {
        setHasMore(true);
        setIsFetchingMore(false);
        setLoading(false);
        // Cleanup function to reset state or perform any necessary cleanup
        // when the component is unmounted or the screen is blurred
      };
    }, [activeFilter]) 
  );

  const loadMoreOccurrences = async () => {
    if (isFetchingMore || !hasMore || occurrences.length === 0) return;
    setIsFetchingMore(true);
    const lastOccurrence = occurrences[occurrences.length - 1];
    const maxTimeId = lastOccurrence.time_id;

    const moreData = await fetchOccurrences(maxTimeId);
    setOccurrences((prev) => [...prev, ...moreData]);
    setHasMore(moreData.length > 0);
    setIsFetchingMore(false);
  };

  const renderOccurrence = ({
    item: occurrence,
  }: {
    item: OccurrenceListResponse;
  }) => (
    <OccurrenceCard
      color={statusToColor[occurrence.status]}
      photo_id={occurrence.photo_id}
      title={translate(occurrence.category)}
      date={occurrence.date}
      onPress={() =>
        router.push(`/occurrence-info/${occurrence.occurrence_id}`)
      }
    />
  );

  const renderFooter = () => {
    if (!isFetchingMore) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  };

  const statusToColor: Record<string, string> = {
    // pending, in_progress, resolved are DB values
    pending: 'bg-red-300',
    in_progress: 'bg-yellow-300',
    resolved: 'bg-green-300',
  };

  const statusMapping: Record<string, string> = {
    // pending, in_progress, resolved are DB values
    pending: translate('pending'),
    in_progress: translate('in_progress'),
    resolved: translate('resolved'),
  };

  const handlePress = (selectedStatus: string) => {
    if (selectedStatus !== activeFilter) {
      setActiveFilter(selectedStatus);
    }
  };

  const StatusFilter = () => {
    return (
      <View className="border-b border-b-gray-100 flex-row justify-between px-4 py-4 bg-white">
        {Object.entries(statusMapping).map(([dbValue, translatedValue]) => (
          <CustomButton
            key={dbValue}
            title={translatedValue}
            containerStyles={`!bg-gray-200 px-3 py-1 ${
              activeFilter === dbValue
                ? '!border-primary border-2'
                : 'border-2 border-gray-200'
            }`}
            textStyles={`${
              activeFilter === dbValue ? '!text-primary' : '!text-gray-700'
            }`}
            handlePress={() => handlePress(dbValue)}
          />
        ))}
      </View>
    );
  };

  return (
    <>
      <StatusFilter />
      <FlatList
        className="bg-white px-4"
        data={occurrences}
        renderItem={renderOccurrence}
        keyExtractor={(occurrence) => occurrence.occurrence_id}
        onEndReached={loadMoreOccurrences} // Call when the end is reached
        onEndReachedThreshold={0.1} // Call when 10% of the list is reached
        ListFooterComponent={renderFooter} // Show loading indicator
        ListEmptyComponent={
          <View className="w-full h-full flex pt-12 items-center">
            <Text className="text-gray-500 text-2xl">
              {translate('no_occurrences_' + activeFilter)}
            </Text>
          </View>
        }
      />
    </>
  );
});

export default List;

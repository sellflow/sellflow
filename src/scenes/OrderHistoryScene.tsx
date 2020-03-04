import React from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ActivityIndicator, Text } from 'exoflex';

import { OrderHistoryItem } from '../components';
import { StackNavProp, StackRouteProp } from '../types/Navigation';
import { useOrderHistory } from '../hooks/api/useOrderHistory';

export default function OrderHistoryScene() {
  let { navigate } = useNavigation<StackNavProp<'OrderHistory'>>();
  let {
    params: { customerAccessToken },
  } = useRoute<StackRouteProp<'OrderHistory'>>();
  let first = 10;
  let {
    orderHistory,
    loading,
    refetch,
    isFetchingMore,
    hasMore,
  } = useOrderHistory(first, customerAccessToken);

  if (loading && !isFetchingMore) {
    return <ActivityIndicator style={styles.center} />;
  }

  let onEndReached = ({ distanceFromEnd }: { distanceFromEnd: number }) => {
    if (distanceFromEnd > 0 && !isFetchingMore && hasMore) {
      refetch({
        customerAccessToken,
        first,
        after: orderHistory[orderHistory.length - 1].cursor || null,
      });
    }
  };

  return (
    <FlatList
      data={orderHistory}
      renderItem={({ item }) => (
        <OrderHistoryItem
          order={item}
          onPress={() => navigate('OrderDetails', { order: item })}
        />
      )}
      keyExtractor={(item) => item.orderID}
      contentContainerStyle={styles.contentContainer}
      ListEmptyComponent={() => (
        <View style={styles.center}>
          <Text>{t('No orders yet')}</Text>
        </View>
      )}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.25}
      ListFooterComponent={() => {
        return hasMore ? <ActivityIndicator /> : null;
      }}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
});

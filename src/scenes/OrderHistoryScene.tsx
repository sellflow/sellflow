import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import { useNavigation, useRoute } from '@react-navigation/native';

import { ErrorPage, OrderHistoryItem } from '../components';
import { Text } from '../core-ui';
import { useOrderHistory } from '../hooks/api/useOrderHistory';
import { StackNavProp, StackRouteProp } from '../types/Navigation';
import useDefaultCountry from '../hooks/api/useDefaultCountry';

export default function OrderHistoryScene() {
  let { navigate } = useNavigation<StackNavProp<'OrderHistory'>>();
  let {
    params: { customerAccessToken },
  } = useRoute<StackRouteProp<'OrderHistory'>>();
  let first = 10;
  let {
    orderHistory,
    error,
    loading,
    refetch,
    isFetchingMore,
    hasMore,
  } = useOrderHistory(first, customerAccessToken);

  let {
    data: { countryCode },
  } = useDefaultCountry();

  if (error) {
    return (
      <ErrorPage
        onRetry={() =>
          refetch({
            customerAccessToken,
            first,
            after: orderHistory[orderHistory.length - 1].cursor || null,
            country: countryCode,
          })
        }
      />
    );
  }
  if (loading && !isFetchingMore) {
    return <ActivityIndicator style={styles.center} />;
  }

  let onEndReached = () => {
    if (!isFetchingMore && hasMore) {
      refetch({
        customerAccessToken,
        first,
        after: orderHistory[orderHistory.length - 1].cursor || null,
        country: countryCode,
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
      ListEmptyComponent={() => {
        return hasMore ? null : (
          <View style={styles.center}>
            <Text>{t('No orders yet')}</Text>
          </View>
        );
      }}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.25}
      ListFooterComponent={() => {
        return hasMore ? (
          <ActivityIndicator style={styles.activityIndicator} />
        ) : null;
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
    flexGrow: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  activityIndicator: {
    marginVertical: 24,
  },
});

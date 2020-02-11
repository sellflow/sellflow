import React, { useEffect } from 'react';
import { StyleSheet, FlatList, AsyncStorage, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, Text } from 'exoflex';

import { OrderHistoryItem } from '../components';
import { StackNavProp } from '../types/Navigation';
import { useOrderHistoryQuery } from '../hooks/api/useOrderHistory';

export default function OrderHistoryScene() {
  let { navigate } = useNavigation<StackNavProp<'OrderHistory'>>();
  let { getOrderHistory, orders } = useOrderHistoryQuery();

  // TODO: Refactor this as a helper or pass down the access token from Profile Scene
  useEffect(() => {
    let fetchOrderHistory = async () => {
      let customerAccessToken = await AsyncStorage.getItem('accessToken');
      if (!customerAccessToken) {
        return;
      }
      getOrderHistory({ variables: { customerAccessToken } });
    };
    fetchOrderHistory();
  }, [getOrderHistory]);

  if (orders.length < 1) {
    return <ActivityIndicator style={styles.center} />;
  }

  return (
    <FlatList
      data={orders}
      renderItem={({ item }) => (
        <OrderHistoryItem
          order={item}
          onPress={({ orderID }) => navigate('OrderDetails', { orderID })}
        />
      )}
      keyExtractor={(item) => item.orderID}
      contentContainerStyle={styles.contentContainer}
      ListEmptyComponent={() => (
        <View style={styles.center}>
          <Text>{t('No orders yet')}</Text>
        </View>
      )}
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

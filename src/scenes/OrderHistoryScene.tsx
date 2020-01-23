import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { orders } from '../fixtures/orderHistory';
import { OrderHistoryItem } from '../components';
import { StackNavProp } from '../types/Navigation';

export default function OrderHistoryScene() {
  let { navigate } = useNavigation<StackNavProp<'OrderHistory'>>();
  return (
    <FlatList
      data={orders} // TODO: Change data
      renderItem={({ item }) => (
        <OrderHistoryItem
          order={item}
          onPress={({ orderID }) => navigate('OrderDetails', { orderID })}
        />
      )}
      keyExtractor={(item) => item.orderID}
      contentContainerStyle={styles.contentContainer}
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
});

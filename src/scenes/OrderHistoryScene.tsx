import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { orders } from '../fixtures/orderHistory';
import { OrderHistoryItem } from '../component';
import { NavigationProp } from '../types/Navigation';

export default function OrderHistoryScene() {
  let { navigate } = useNavigation<NavigationProp<'OrderHistory'>>();
  return (
    <View style={styles.container}>
      <FlatList
        data={orders} // TODO: Change data
        renderItem={({ item }) => (
          <OrderHistoryItem
            order={item}
            onPress={({ orderID }) => navigate('OrderDetails', { orderID })}
          />
        )}
        keyExtractor={(item) => item.orderID}
        showsVerticalScrollIndicator={false}
        style={styles.orderHistoryList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingHorizontal: 24,
  },
  orderHistoryList: {
    marginBottom: 24,
  },
});

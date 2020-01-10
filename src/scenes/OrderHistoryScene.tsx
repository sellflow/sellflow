import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

import { order } from '../fixtures/orderHistory';
import { OrderHistoryItem } from '../component';

export default function OrderHistoryScene() {
  return (
    <View style={styles.container}>
      <FlatList
        data={order} // TODO: Change data
        renderItem={({ item }) => <OrderHistoryItem order={item} />}
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

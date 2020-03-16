import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { StyleSheet, View } from 'react-native';

import { OrderHistoryItem } from '../../../components';
import { orderHistory } from '../../../fixtures/OrderHistoryItem';

export default function orderHistoryItemStory() {
  return storiesOf('Order History Item', module).add(
    'Order History Item',
    () => {
      return (
        <View style={styles.container}>
          <OrderHistoryItem order={orderHistory} onPress={() => {}} />
          <OrderHistoryItem order={orderHistory} onPress={() => {}} />
        </View>
      );
    },
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 100,
    justifyContent: 'center',
    marginHorizontal: 10,
  },
});

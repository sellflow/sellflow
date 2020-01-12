import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { View, StyleSheet, FlatList } from 'react-native';

import { OrderItem } from '../../../components';
import { OrderData } from '../../../fixtures/OrderItemData';

export default function orderItemStory() {
  return storiesOf('OrderItem', module).add('OrderItem', () => (
    <View style={style.container}>
      <FlatList
        style={{ marginHorizontal: 10, flex: 1 }}
        data={OrderData}
        renderItem={({ item }) => <OrderItem orderItem={item} />}
        keyExtractor={({ variantID }) => variantID}
      />
    </View>
  ));
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 100,
    justifyContent: 'center',
    marginHorizontal: 10,
  },
});

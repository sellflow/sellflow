import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { View, StyleSheet, FlatList } from 'react-native';
import { MockedProvider } from '@apollo/react-testing';

import { OrderItem } from '../../../components';
import { OrderData } from '../../../fixtures/OrderItemData';
import { MOCKED_SHOP } from '../../../__mocks__/mockedData';
import { setDefaultCurrencyResolver } from '../../../graphql/resolvers/setDefaultCurrencyResolver';

export default function orderItemStory() {
  return storiesOf('OrderItem', module).add('OrderItem', () => (
    <MockedProvider
      mocks={MOCKED_SHOP}
      addTypename={false}
      resolvers={{
        Mutation: {
          setDefaultCurrency: setDefaultCurrencyResolver,
        },
      }}
    >
      <View style={style.container}>
        <FlatList
          style={{ marginHorizontal: 10, flex: 1 }}
          data={OrderData}
          renderItem={({ item }) => (
            <OrderItem cardType="checkout" orderItem={item} />
          )}
          keyExtractor={({ variantID }) => variantID}
        />
      </View>
    </MockedProvider>
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

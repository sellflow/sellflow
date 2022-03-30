import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { MockedProvider } from '@apollo/react-testing';
import { storiesOf } from '@storybook/react-native';

import { MOCKED_SHOP } from '../../../__mocks__/mockedData';
import { OrderItem } from '../../../components';
import { OrderData } from '../../../fixtures/OrderItemData';
import { setDefaultCountryResolver } from '../../../graphql/resolvers/setDefaultCountryResolver';

export default function orderItemStory() {
  return storiesOf('OrderItem', module).add('OrderItem', () => (
    <MockedProvider
      mocks={MOCKED_SHOP}
      addTypename={false}
      resolvers={{
        Mutation: {
          setDefaultCountry: setDefaultCountryResolver,
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

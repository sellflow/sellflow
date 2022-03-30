import React from 'react';
import { StyleSheet, View } from 'react-native';

import { MockedProvider } from '@apollo/react-testing';
import { storiesOf } from '@storybook/react-native';

import { MOCKED_SHOP } from '../../../__mocks__/mockedData';
import { OrderHistoryItem } from '../../../components';
import { orderHistory } from '../../../fixtures/OrderHistoryItem';
import { setDefaultCountryResolver } from '../../../graphql/resolvers/setDefaultCountryResolver';

export default function orderHistoryItemStory() {
  return storiesOf('Order History Item', module).add(
    'Order History Item',
    () => {
      return (
        <MockedProvider
          mocks={MOCKED_SHOP}
          addTypename={false}
          resolvers={{
            Mutation: {
              setDefaultCountry: setDefaultCountryResolver,
            },
          }}
        >
          <View style={styles.container}>
            <OrderHistoryItem order={orderHistory} onPress={() => {}} />
            <OrderHistoryItem order={orderHistory} onPress={() => {}} />
          </View>
        </MockedProvider>
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

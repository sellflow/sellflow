import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { StyleSheet, View } from 'react-native';
import { MockedProvider } from '@apollo/react-testing';

import { OrderHistoryItem } from '../../../components';
import { orderHistory } from '../../../fixtures/OrderHistoryItem';
import { MOCKED_SHOP } from '../../../__mocks__/mockedData';
import { setDefaultCurrencyResolver } from '../../../graphql/resolvers/setDefaultCurrencyResolver';

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
              setDefaultCurrency: setDefaultCurrencyResolver,
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

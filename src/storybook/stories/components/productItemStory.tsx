import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { View, StyleSheet, FlatList } from 'react-native';
import { MockedProvider } from '@apollo/react-testing';

import ProductItem from '../../../components/ProductItem';
import { ProductItemData } from '../../../fixtures/ProductItemData';
import { MOCKED_SHOP } from '../../../__mocks__/mockedData';
import { setDefaultCurrencyResolver } from '../../../graphql/resolvers/setDefaultCurrencyResolver';

export default function ProductItemStory() {
  return storiesOf('ProductItem', module).add('ProductItem', () => (
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
        <FlatList
          data={ProductItemData}
          renderItem={({ item }) => (
            <ProductItem
              product={item}
              onPress={() => {}}
              containerStyle={styles.item}
            />
          )}
          keyExtractor={(item) => item.id}
          numColumns={4}
        />
      </View>
    </MockedProvider>
  ));
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  item: {
    width: 192,
    height: 228,
    maxWidth: 192,
    maxHeight: 228,
  },
});

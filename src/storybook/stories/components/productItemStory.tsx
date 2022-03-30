import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { MockedProvider } from '@apollo/react-testing';
import { storiesOf } from '@storybook/react-native';

import { MOCKED_SHOP } from '../../../__mocks__/mockedData';
import ProductItem from '../../../components/ProductItem';
import { ProductItemData } from '../../../fixtures/ProductItemData';
import { setDefaultCountryResolver } from '../../../graphql/resolvers/setDefaultCountryResolver';

export default function ProductItemStory() {
  return storiesOf('ProductItem', module).add('ProductItem', () => (
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

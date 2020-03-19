import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { View, StyleSheet } from 'react-native';
import { MockedProvider } from '@apollo/react-testing';

import { ProductList } from '../../../components';
import { wishlist } from '../../../fixtures/wishlist';
import { useColumns } from '../../../helpers/columns';
import { MOCKED_SHOP } from '../../../__mocks__/mockedData';
import { setDefaultCurrencyResolver } from '../../../graphql/resolvers/setDefaultCurrencyResolver';

function ProductListStory() {
  let numColumns = useColumns();
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
        <ProductList
          data={wishlist}
          numColumns={numColumns}
          contentContainerStyle={styles.wishlist}
          onItemPress={() => {}}
        />
      </View>
    </MockedProvider>
  );
}

export default function productListStory() {
  return storiesOf('Product List', module).add('Product List', () => (
    <ProductListStory />
  ));
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 100,
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  wishlist: {
    marginBottom: 16,
  },
});

import React from 'react';
import { StyleSheet, View } from 'react-native';

import { MockedProvider } from '@apollo/react-testing';
import { storiesOf } from '@storybook/react-native';

import { MOCKED_SHOP } from '../../../__mocks__/mockedData';
import { ProductList } from '../../../components';
import { wishlist } from '../../../fixtures/wishlist';
import { setDefaultCountryResolver } from '../../../graphql/resolvers/setDefaultCountryResolver';
import { useColumns } from '../../../helpers/columns';

function ProductListStory() {
  let numColumns = useColumns();
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

import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { View, StyleSheet } from 'react-native';

import { ProductList } from '../../../components';
import { wishlist } from '../../../fixtures/wishlist';
import {
  useDimensions,
  ScreenSize,
  NUM_COLUMNS,
} from '../../../helpers/dimensions';

function ProductListStory() {
  let numColumns: number;
  let { screenSize } = useDimensions();

  switch (screenSize) {
    case ScreenSize.Medium: {
      numColumns = NUM_COLUMNS.MEDIUM;
      break;
    }
    case ScreenSize.Large: {
      numColumns = NUM_COLUMNS.LARGE;
      break;
    }
    default: {
      numColumns = NUM_COLUMNS.SMALL;
    }
  }
  return (
    <View style={styles.container}>
      <ProductList
        data={wishlist}
        numColumns={numColumns}
        contentContainerStyle={styles.wishlist}
        onItemPress={() => {}}
      />
    </View>
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

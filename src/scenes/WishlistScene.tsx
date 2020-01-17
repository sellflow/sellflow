import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'exoflex';

import { wishlist } from '../fixtures/wishlist';
import { ProductList } from '../components';
import { useDimensions, ScreenSize, NUM_COLUMNS } from '../helpers/dimensions';
import { FONT_SIZE } from '../constants/fonts';

export default function WishlistScene() {
  let { screenSize } = useDimensions();
  let numColumns: number;

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

  if (wishlist.length === 0) {
    return (
      <View style={styles.emptyWishlist}>
        <Text style={styles.emptyWishlistText}>{t('No products yet.')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.count}>
        {t('Showing {count} item(s)', { count: wishlist.length })}
      </Text>
      <ProductList
        data={wishlist}
        numColumns={numColumns}
        contentContainerStyle={styles.wishlist}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  emptyWishlist: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyWishlistText: {
    fontSize: FONT_SIZE.medium,
  },
  count: {
    marginLeft: 12,
    marginBottom: 16,
  },
  wishlist: {
    marginBottom: 16,
  },
});

import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { View, StyleSheet, FlatList } from 'react-native';

import ProductItem from '../../../components/ProductItem';
import { ProductItemData } from '../../../fixtures/ProductItemData';

export default function ProductItemStory() {
  return storiesOf('ProductItem', module).add('ProductItem', () => (
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

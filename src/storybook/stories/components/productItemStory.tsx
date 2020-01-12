import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { View, StyleSheet, FlatList } from 'react-native';

import ProductItem from '../../../components/ProductItem';

export default function ProductItemStory() {
  type Product = {
    id: number;
    uri: string;
    name: string;
    price: number;
    discount?: number;
  };

  type Data = { product: Array<Product> };

  let DATA: Data = {
    product: [
      {
        id: 1,
        uri: 'https://s7d5.scene7.com/is/image/UrbanOutfitters/51302875_016_b',
        name: 'Box Flannel Trucker',
        price: 1000,
      },
      {
        id: 2,
        uri: 'https://s7d5.scene7.com/is/image/UrbanOutfitters/51302875_016_b',
        name: 'Box Flannel Trucker',
        price: 1000,
      },
      {
        id: 3,
        uri: 'https://s7d5.scene7.com/is/image/UrbanOutfitters/51302875_016_b',
        name: 'Box Flannel Trucker',
        price: 1000,
        discount: 75,
      },
      {
        id: 4,
        uri: 'https://s7d5.scene7.com/is/image/UrbanOutfitters/51302875_016_b',
        name: 'Box Flannel Trucker',
        price: 1000,
      },
      {
        id: 5,
        uri: 'https://s7d5.scene7.com/is/image/UrbanOutfitters/51302875_016_b',
        name: 'Box Flannel Trucker',
        price: 1000,
        discount: 25,
      },
      {
        id: 6,
        uri: 'https://s7d5.scene7.com/is/image/UrbanOutfitters/51302875_016_b',
        name: 'Box Flannel Trucker',
        price: 1000,
      },
      {
        id: 7,
        uri: 'https://s7d5.scene7.com/is/image/UrbanOutfitters/51302875_016_b',
        name: 'Box Flannel Trucker',
        price: 1000,
      },
      {
        id: 8,
        uri: 'https://s7d5.scene7.com/is/image/UrbanOutfitters/51302875_016_b',
        name: 'Box Flannel Trucker',
        price: 1000,
      },
      {
        id: 9,
        uri: 'https://s7d5.scene7.com/is/image/UrbanOutfitters/51302875_016_b',
        name: 'Box Flannel Trucker',
        price: 1000,
        discount: 50,
      },
      {
        id: 10,
        uri: 'https://s7d5.scene7.com/is/image/UrbanOutfitters/51302875_016_b',
        name: 'Box Flannel Trucker',
        price: 1000,
      },
      {
        id: 11,
        uri: 'https://s7d5.scene7.com/is/image/UrbanOutfitters/51302875_016_b',
        name: 'Box Flannel Trucker',
        price: 1000,
      },
      {
        id: 12,
        uri: 'https://s7d5.scene7.com/is/image/UrbanOutfitters/51302875_016_b',
        name: 'Box Flannel Trucker',
        price: 1000,
      },
      {
        id: 13,
        uri: 'https://s7d5.scene7.com/is/image/UrbanOutfitters/51302875_016_b',
        name: 'Box Flannel Trucker',
        price: 1000,
      },
    ],
  };

  return storiesOf('ProductItem', module).add('ProductItem', () => (
    <View style={styles.container}>
      <FlatList
        data={DATA.product}
        renderItem={(item) => (
          <ProductItem
            uri={item.item.uri}
            name={item.item.name}
            price={item.item.price}
            discount={item.item.discount}
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onPress={() => {}}
            containerStyle={styles.item}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
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

import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { View, StyleSheet, FlatList } from 'react-native';

import ProductItem from '../../../components/ProductItem';
import { Product } from '../../../types/types';

let exampleProducts: Array<Product> = [
  {
    id: '1',
    image: 'https://s7d5.scene7.com/is/image/UrbanOutfitters/51302875_016_b',
    name: 'Box Flannel Trucker',
    price: 1000,
  },
  {
    id: '2',
    image: 'https://s7d5.scene7.com/is/image/UrbanOutfitters/51302875_016_b',
    name: 'Box Flannel Trucker',
    price: 1000,
  },
  {
    id: '3',
    image: 'https://s7d5.scene7.com/is/image/UrbanOutfitters/51302875_016_b',
    name: 'Box Flannel Trucker',
    price: 1000,
    discount: 75,
  },
  {
    id: '4',
    image: 'https://s7d5.scene7.com/is/image/UrbanOutfitters/51302875_016_b',
    name: 'Box Flannel Trucker',
    price: 1000,
  },
  {
    id: '5',
    image: 'https://s7d5.scene7.com/is/image/UrbanOutfitters/51302875_016_b',
    name: 'Box Flannel Trucker',
    price: 1000,
    discount: 25,
  },
  {
    id: '6',
    image: 'https://s7d5.scene7.com/is/image/UrbanOutfitters/51302875_016_b',
    name: 'Box Flannel Trucker',
    price: 1000,
  },
  {
    id: '7',
    image: 'https://s7d5.scene7.com/is/image/UrbanOutfitters/51302875_016_b',
    name: 'Box Flannel Trucker',
    price: 1000,
  },
  {
    id: '8',
    image: 'https://s7d5.scene7.com/is/image/UrbanOutfitters/51302875_016_b',
    name: 'Box Flannel Trucker',
    price: 1000,
  },
  {
    id: '9',
    image: 'https://s7d5.scene7.com/is/image/UrbanOutfitters/51302875_016_b',
    name: 'Box Flannel Trucker',
    price: 1000,
    discount: 50,
  },
  {
    id: '10',
    image: 'https://s7d5.scene7.com/is/image/UrbanOutfitters/51302875_016_b',
    name: 'Box Flannel Trucker',
    price: 1000,
  },
  {
    id: '11',
    image: 'https://s7d5.scene7.com/is/image/UrbanOutfitters/51302875_016_b',
    name: 'Box Flannel Trucker',
    price: 1000,
  },
  {
    id: '12',
    image: 'https://s7d5.scene7.com/is/image/UrbanOutfitters/51302875_016_b',
    name: 'Box Flannel Trucker',
    price: 1000,
  },
  {
    id: '13',
    image: 'https://s7d5.scene7.com/is/image/UrbanOutfitters/51302875_016_b',
    name: 'Box Flannel Trucker',
    price: 1000,
  },
];

export default function ProductItemStory() {
  return storiesOf('ProductItem', module).add('ProductItem', () => (
    <View style={styles.container}>
      <FlatList
        data={exampleProducts}
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

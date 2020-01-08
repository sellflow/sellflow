import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { View, StyleSheet } from 'react-native';

import { CategoryItem } from '../../../core-ui';

export default function categoryItemStory() {
  return storiesOf('Category Item', module).add('Default', () => (
    <View style={style.container}>
      <CategoryItem
        data={[
          {
            node: 'Jacket',
          },
          { node: 'Jeans' },
          { node: 'Accesories' },
          { node: 'Jewelry' },
          {
            node: 'Boots',
            imageSrc:
              'https://cdn.shopify.com/s/files/1/1312/0893/products/002_grande_d74b53c6-ff42-4143-9728-2666f568632a.jpg?v=1491918957',
          },
        ]}
        onSelect={(item) => item}
      />
    </View>
  ));
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

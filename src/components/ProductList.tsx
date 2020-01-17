import React from 'react';
import { FlatList, View, StyleProp, ViewStyle } from 'react-native';

import { Product } from '../types/types';
import ProductItem from './ProductItem';

type Props = {
  numColumns: number;
  data: Array<Product>;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export default function ProductList(props: Props) {
  let { numColumns, data, contentContainerStyle } = props;
  let itemRemainder: number = data.length % numColumns;

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      key={numColumns}
      renderItem={({ item, index }) => {
        let productItem = <ProductItem product={item} onPress={() => {}} />;
        if (index >= data.length - itemRemainder) {
          return <View style={{ flex: 1 / numColumns }}>{productItem}</View>;
        }
        return productItem;
      }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={contentContainerStyle}
    />
  );
}

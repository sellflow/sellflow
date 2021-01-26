import React from 'react';
import { FlatList, View, FlatListProps } from 'react-native';

import { Product } from '../types/types';

import ProductItem from './ProductItem';

type BaseProps = FlatListProps<Product>;

type Props = Omit<BaseProps, 'data' | 'renderItem' | 'numColumns'> & {
  numColumns: number;
  data: Array<Product>;
  onItemPress: (item: Product) => void;
};

export default function ProductList(props: Props) {
  let { numColumns, data, onItemPress, ...otherProps } = props;
  let itemRemainder: number = data.length % numColumns;

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      key={numColumns}
      renderItem={({ item, index }) => {
        let productItem = (
          <ProductItem product={item} onPress={() => onItemPress(item)} />
        );
        if (index >= data.length - itemRemainder) {
          return <View style={{ flex: 1 / numColumns }}>{productItem}</View>;
        }
        return productItem;
      }}
      showsVerticalScrollIndicator={false}
      {...otherProps}
    />
  );
}

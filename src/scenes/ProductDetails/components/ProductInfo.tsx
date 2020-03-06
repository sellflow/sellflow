import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TextInput } from 'exoflex';

import { FONT_SIZE } from '../../../constants/fonts';
import formatCurrency from '../../../helpers/formatCurrency';
import { TabView, RichRadioGroup } from '../../../core-ui';
import {
  Product,
  Tabs,
  OptionsData,
  Options,
  TabRoute,
} from '../../../types/types';
import { valueBetweenZeroToMax } from '../../../helpers/valueBetweenZeroToMax';
import { COLORS } from '../../../constants/colors';
import { priceAfterDiscount } from '../../../helpers/priceAfterDiscount';

type Props = {
  onSelectionOptionChange: (key: string, value: string) => void;
  selectedOptions: OptionsData;
  productOriginalPrice: number;
  quantity: number;
  onChangeQuantity: (qunatity: number) => void;
  product: Product;
  options: Options;
  infoTabs: Tabs;
};

function infoTabRoutes(infoTabs: Tabs): Array<TabRoute> {
  return infoTabs.map(({ title, content }, i) => ({
    key: i.toString(),
    title,
    scene: () => <TabPane content={content} />,
  }));
}

function TabPane(props: { content: string }) {
  return (
    <View style={[styles.padding, styles.flex]}>
      <Text>{props.content}</Text>
    </View>
  );
}

export default function ProductInfo(props: Props) {
  let {
    product,
    productOriginalPrice,
    options,
    infoTabs,
    quantity,
    selectedOptions,
    onChangeQuantity,
    onSelectionOptionChange,
  } = props;

  let afterDiscount = priceAfterDiscount(product.price, product.discount || 0);

  let radioGroupRenderView = options.map(({ name, values }) => {
    return (
      <RichRadioGroup
        key={name}
        name={name}
        values={values}
        selectedValue={selectedOptions[name]}
        onSelect={(value) => {
          onSelectionOptionChange(name, value);
        }}
      />
    );
  });

  return (
    <>
      <View style={styles.padding}>
        <Text style={styles.productInfoTitle}>{product.title}</Text>
        {productOriginalPrice && productOriginalPrice > 0 ? (
          <View style={styles.flexRow}>
            <Text weight="bold" style={styles.productInfoPrice}>
              {formatCurrency(afterDiscount)}
            </Text>
            <Text weight="bold" style={styles.productInfoOriginalPrice}>
              {formatCurrency(product.price)}
            </Text>
          </View>
        ) : (
          <Text weight="bold" style={styles.productInfoPrice}>
            {formatCurrency(product.price)}
          </Text>
        )}
      </View>
      {radioGroupRenderView}
      <View style={styles.paddingHorizontal}>
        <Text style={styles.quantityText}>Quantity</Text>
        <TextInput
          containerStyle={styles.textInputStyle}
          value={quantity.toString()}
          onBlur={() => {
            if (quantity === 0) {
              onChangeQuantity(1);
            }
          }}
          onChangeText={(value) =>
            onChangeQuantity(valueBetweenZeroToMax(parseInt(value, 10), 100))
          }
        />
      </View>
      <TabView isScrollEnabled={true} routes={infoTabRoutes(infoTabs)} />
    </>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  padding: {
    padding: 24,
  },
  paddingHorizontal: {
    paddingHorizontal: 24,
  },
  productInfoTitle: {
    marginBottom: 8,
    fontSize: FONT_SIZE.medium,
  },
  productInfoPrice: {
    fontSize: FONT_SIZE.large,
  },
  quantityText: {
    opacity: 0.6,
    fontSize: FONT_SIZE.small,
    marginBottom: 12,
  },
  textInputStyle: {
    width: 80,
    height: 48,
  },
  flexRow: {
    flexDirection: 'row',
  },
  productInfoOriginalPrice: {
    paddingLeft: 8,
    color: COLORS.priceGrey,
    fontSize: FONT_SIZE.large,
    textDecorationLine: 'line-through',
  },
});

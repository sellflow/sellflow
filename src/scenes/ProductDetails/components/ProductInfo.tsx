import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { COLORS } from '../../../constants/colors';
import { FONT_SIZE } from '../../../constants/fonts';
import { outlinedTextInput } from '../../../constants/theme';
import { RichRadioGroup, Text, TextInput } from '../../../core-ui';
import { priceAfterDiscount } from '../../../helpers/priceAfterDiscount';
import { valueBetweenZeroToMax } from '../../../helpers/valueBetweenZeroToMax';
import useCurrencyFormatter from '../../../hooks/api/useCurrencyFormatter';
import { Options, OptionsData, ProductDetails } from '../../../types/types';

type Props = {
  onSelectionOptionChange: (key: string, value: string) => void;
  selectedOptions: OptionsData;
  quantity: number;
  onChangeQuantity: (qunatity: number) => void;
  product: ProductDetails;
  options: Options;
};

export default function ProductInfo(props: Props) {
  let {
    product: { title, description, price, discount, quantityAvailable = 0 },
    options,
    quantity,
    selectedOptions,
    onChangeQuantity,
    onSelectionOptionChange,
  } = props;
  let formatCurrency = useCurrencyFormatter();

  let afterDiscount = priceAfterDiscount(price, discount || 0);
  let radioGroupRenderView = null;
  if (
    !(
      options.length === 1 &&
      options[0].name === 'Title' &&
      options[0].values[0] === 'Default Title'
    )
  ) {
    radioGroupRenderView = options.map(({ name, values }) => {
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
  }

  useEffect(() => {
    if (quantity === 0) {
      onChangeQuantity(1);
    } else if (quantity > quantityAvailable) {
      onChangeQuantity(quantityAvailable);
    }
  }, [quantityAvailable]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <View style={styles.padding}>
        <Text style={styles.productInfoTitle}>{title}</Text>
        {discount > 0 ? (
          <View style={styles.flexRow}>
            <Text weight="bold" style={styles.productInfoPrice}>
              {formatCurrency(afterDiscount)}
            </Text>
            <Text weight="bold" style={styles.productInfoOriginalPrice}>
              {formatCurrency(price)}
            </Text>
          </View>
        ) : (
          <Text weight="bold" style={styles.productInfoPrice}>
            {formatCurrency(price)}
          </Text>
        )}
      </View>
      {radioGroupRenderView}
      <View style={styles.paddingHorizontal}>
        <Text style={styles.quantityText}>{t('Quantity')}</Text>
        <TextInput
          containerStyle={[outlinedTextInput, styles.textInputWidth]}
          style={outlinedTextInput}
          value={quantity.toString()}
          onBlur={() => {}}
          onChangeText={(value: string) =>
            onChangeQuantity(
              valueBetweenZeroToMax(parseInt(value, 10), quantityAvailable),
            )
          }
          keyboardType="numeric"
        />
      </View>
      <View style={[styles.paddingHorizontal, styles.description]}>
        <Text style={styles.labelStyle}>{t('Description')}</Text>
        <Text>{description || t('No description')}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
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
  textInputWidth: {
    width: 60,
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
  labelStyle: {
    opacity: 0.6,
    marginBottom: 12,
  },
  description: {
    marginTop: 16,
    marginBottom: 24,
  },
});

import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, RadioButton, IconButton, Button } from 'exoflex';
import { CheckoutAddress } from '../components';

import { Surface } from '../core-ui';
import { addressItemData } from '../fixtures/AddressItemData';
import { useDimensions, ScreenSize } from '../helpers/dimensions';
import { FONT_SIZE } from '../constants/fonts';
import { COLORS } from '../constants/colors';
import formatCurrency from '../helpers/formatCurrency';

export default function CheckoutScene() {
  let [selectedAddress, setSelectedAddress] = useState(0);

  useEffect(() => {
    let defaultAddress =
      addressItemData.find((item) => item.default === true) ||
      addressItemData[0];
    setSelectedAddress(defaultAddress.id);
  }, []);

  let dimensions = useDimensions();

  let containerStyle = () => {
    let styleApplied;
    let priceView;

    switch (dimensions.screenSize) {
      case ScreenSize.Small: {
        styleApplied = styles.normal;
        priceView = styles.pricePortrait;
        break;
      }
      case ScreenSize.Medium: {
        styleApplied = styles.tabPortrait;
        priceView = styles.pricePortrait;
        break;
      }
      case ScreenSize.Large: {
        styleApplied = styles.landscape;
        priceView = styles.priceLandscape;
        break;
      }
    }
    return { styleApplied, priceView };
  };

  return (
    <View style={containerStyle().styleApplied}>
      <View style={styles.listContainer}>
        <Text>{t('Shipping Address')}</Text>
        <RadioButton.Group value="Address List">
          <FlatList
            data={addressItemData}
            renderItem={({ item }) => (
              <CheckoutAddress
                style={styles.topMargin}
                data={item}
                isSelected={selectedAddress === item.id}
                onSelect={() => setSelectedAddress(item.id)}
              />
            )}
            keyExtractor={(data) => data.id.toString()}
            ListFooterComponent={() => (
              <TouchableOpacity
                onPress={() => {}}
                style={styles.newAddressButton}
              >
                <IconButton icon="plus" color={COLORS.primaryColor} />
                <Text style={styles.buttonText} weight="medium">
                  {t('Add New Address')}
                </Text>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            style={[styles.topMargin, styles.bottomMargin]}
          />
        </RadioButton.Group>
      </View>
      <View style={containerStyle().priceView}>
        <Surface mode="row">
          <Text style={styles.mediumText}>{t('Subtotal')}</Text>
          <Text style={styles.mediumText}>{formatCurrency(123)}</Text>
        </Surface>
        <Surface mode="row">
          <Text style={styles.mediumText}>{t('Shipping')}</Text>
          <Text style={[styles.upperCase, styles.mediumText]}>{t('Free')}</Text>
        </Surface>
        <View style={styles.totalBorder} />
        <Surface mode="row">
          <Text style={styles.mediumText}>{t('Total')}</Text>
          <Text style={styles.mediumText}>{formatCurrency(123)}</Text>
        </Surface>
        <Button style={styles.verticalMargin}>{t('Proceed to payment')}</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: { flex: 1.2, marginHorizontal: 12 },
  mediumText: { fontSize: FONT_SIZE.medium },
  newAddressButton: {
    marginTop: 16,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
  },
  buttonText: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.primaryColor,
  },
  topMargin: { marginTop: 12 },
  bottomMargin: { marginBottom: 24 },
  upperCase: { textTransform: 'uppercase' },
  verticalMargin: { marginVertical: 24 },
  normal: {
    paddingHorizontal: 12,
    paddingTop: 16,
    flex: 1,
    backgroundColor: COLORS.white,
  },
  tabPortrait: {
    paddingHorizontal: 12,
    paddingTop: 16,
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
  },
  landscape: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 24,
    backgroundColor: COLORS.white,
  },
  priceLandscape: { flex: 1, marginHorizontal: 12 },
  pricePortrait: { marginHorizontal: 12 },
  totalBorder: {
    height: 1,
    backgroundColor: COLORS.lightGrey,
    marginHorizontal: 16,
  },
});

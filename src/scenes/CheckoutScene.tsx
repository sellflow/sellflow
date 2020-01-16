import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, RadioButton, IconButton, Button } from 'exoflex';
import { CheckoutAddress } from '../components';

import { Surface } from '../core-ui';
import { addressItemData } from '../fixtures/AddressItemData';
import { useDimensions, ScreenSize } from '../helpers/dimensions';
import { FONT_SIZE } from '../constants/fonts';
import { COLORS } from '../constants/colors';

export default function CheckoutScene() {
  let [selectedIndex, setSelectedIndex] = useState(0);

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
                isSelected={selectedIndex === item.id}
                onSelect={() => setSelectedIndex(item.id)}
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
          />
        </RadioButton.Group>
      </View>
      <View style={containerStyle().priceView}>
        <Surface mode="row">
          <Text>{t('Total Purchase')}</Text>
          <Text>{123}</Text>
        </Surface>
        <Surface mode="row">
          <Text>{t('Shipping Cost')}</Text>
          <Text style={styles.upperCase}>{t('Free')}</Text>
        </Surface>
        <Surface mode="row">
          <Text>{t('Total')}</Text>
          <Text>{123}</Text>
        </Surface>
        <Button style={styles.verticalMargin}>{t('Proceed to payment')}</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: { flex: 1.2, marginHorizontal: 12 },
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
  upperCase: { textTransform: 'uppercase' },
  verticalMargin: { marginVertical: 24 },
  normal: { paddingHorizontal: 12, paddingTop: 16, flex: 1 },
  tabPortrait: {
    paddingHorizontal: 12,
    paddingTop: 16,
    flex: 1,
    justifyContent: 'space-between',
  },
  landscape: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  priceLandscape: { flex: 1, marginHorizontal: 12 },
  pricePortrait: { marginHorizontal: 12 },
});

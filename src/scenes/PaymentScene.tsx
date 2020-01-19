import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, RadioButton, Text } from 'exoflex';

import { Surface } from '../core-ui';
import { OrderItem } from '../components';
import { COLORS } from '../constants/colors';
import { FONT_SIZE } from '../constants/fonts';
import formatAddress from '../helpers/formatAddress';
import { OrderData2 } from '../fixtures/OrderItemData';
import { addressItemData } from '../fixtures/AddressItemData';
import { ScreenSize, useDimensions } from '../helpers/dimensions';
import formatCurrency from '../helpers/formatCurrency';

export default function PaymentScene() {
  let { screenSize, isLandscape } = useDimensions();
  let [selectedPayment, setSelectedPayment] = useState(0);
  let availablePayments = ['PayPal', 'Credit Card', 'Bank Transfer'];
  let subtotal = 77;
  let shipping = 0;
  let total = subtotal + shipping;
  let orderData = OrderData2;
  let address = addressItemData[0];

  let orderSummary = (
    <View style={styles.flex}>
      <Text style={styles.labelOpacity}>{t('Select Payment Method')}</Text>
      <RadioButton.Group value="Payment Method">
        {availablePayments.map((item, index) => (
          <RadioButton
            key={item}
            checked={selectedPayment === index}
            label={item}
            onPress={() => {
              setSelectedPayment(index);
            }}
            style={
              selectedPayment === index
                ? styles.radioButtonActive
                : styles.radioButtonInactive
            }
          />
        ))}
      </RadioButton.Group>
      <Text style={[styles.marginTop, styles.labelOpacity]}>
        {t('Shipping Address')}
      </Text>
      <Surface containerStyle={styles.surfaceAddress}>
        <Text style={styles.mediumText}>{address.name}</Text>
        {formatAddress(address).map((item) => (
          <Text key={item} style={[styles.address, styles.labelOpacity]}>
            {item}
          </Text>
        ))}
        <Text style={[styles.labelOpacity, styles.phone]}>
          {t('Phone: {phone}', { phone: address.phone })}
        </Text>
      </Surface>
      <Text style={[styles.labelOrder, styles.labelOpacity]}>
        {t('Order Summary')}
      </Text>
      {orderData.map((item) => (
        <OrderItem orderItem={item} key={item.variantID} />
      ))}
    </View>
  );

  let checkoutSummary = (
    <View>
      <View style={styles.surfacePrice}>
        <Surface mode="row">
          <Text style={styles.mediumText}>{t('Subtotal')}</Text>
          <Text style={styles.mediumText}>{formatCurrency(subtotal)}</Text>
        </Surface>
        <Surface mode="row">
          <Text style={styles.mediumText}>{t('Shipping')}</Text>
          <Text style={styles.mediumText}>{formatCurrency(shipping)}</Text>
        </Surface>
        <Surface mode="row">
          <Text style={styles.mediumText}>{t('Total')}</Text>
          <Text style={styles.mediumText} weight="medium">
            {formatCurrency(total)}
          </Text>
        </Surface>
      </View>
      <Button>{t('Pay')}</Button>
    </View>
  );

  return isLandscape ? (
    <View style={styles.horizontalLayout}>
      <ScrollView
        style={styles.horizontalLayoutColumn}
        contentContainerStyle={styles.flexGrow}
      >
        {orderSummary}
      </ScrollView>
      <View style={styles.horizontalLayoutColumn}>{checkoutSummary}</View>
    </View>
  ) : (
    <ScrollView
      style={
        screenSize === ScreenSize.Small
          ? styles.verticalNarrow
          : styles.verticalWide
      }
      contentContainerStyle={styles.flexGrow}
      contentInsetAdjustmentBehavior="automatic"
    >
      {orderSummary}
      {checkoutSummary}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mediumText: { fontSize: FONT_SIZE.medium },
  flexGrow: { flexGrow: 1 },
  radioButtonInactive: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    padding: 12,
  },
  radioButtonActive: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: COLORS.primaryColor,
    padding: 12,
  },
  labelOpacity: { opacity: 0.6 },
  address: {
    fontSize: FONT_SIZE.small,
    color: COLORS.black,
    marginTop: 6,
  },
  phone: {
    marginTop: 6,
  },
  marginTop: { marginTop: 16 },
  flex: { flex: 1 },
  labelOrder: { marginTop: 16, marginBottom: 2 },
  verticalNarrow: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  verticalWide: {
    paddingHorizontal: 36,
    paddingTop: 24,
    paddingBottom: 36,
  },
  horizontalLayout: {
    flex: 1,
    paddingHorizontal: 18,
    flexDirection: 'row',
  },
  horizontalLayoutColumn: {
    flex: 1,
    marginHorizontal: 18,
  },
  surfacePrice: {
    marginTop: 14,
    marginBottom: 24,
  },
  surfaceAddress: {
    marginTop: 12,
  },
});

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, Text } from 'exoflex';

import { Surface } from '../../core-ui';
import { OrderItem } from '../../components';
import { FONT_SIZE } from '../../constants/fonts';
import formatAddress from '../../helpers/formatAddress';
import { OrderData2 } from '../../fixtures/OrderItemData';
import { addressItemData } from '../../fixtures/AddressItemData';
import { useDimensions, ScreenSize } from '../../helpers/dimensions';
import formatCurrency from '../../helpers/formatCurrency';
import { defaultButton, defaultButtonLabel } from '../../constants/theme';
import { PaymentRadioGroup } from './components';
import { Payment } from '../../types/types';

export default function PaymentScene() {
  let { screenSize, isLandscape } = useDimensions();
  let [selectedPaymentType, setSelectedPaymentType] = useState('CREDIT_CARD');
  let [creditCardInfo, setCreditCardInfo] = useState({
    cardNumber: {
      number: '',
      isValid: true,
    },
    name: '',
    expirationDate: {
      date: '',
      isValid: true,
    },
    cvv: '',
  });

  let subtotal = 77;
  let shipping = 0;
  let total = subtotal + shipping;
  let address = addressItemData[0];
  // TODO: Get Accepted Payment Types from the API
  let acceptedPaymentTypes: Array<Payment> = [
    { id: 'CREDIT_CARD', name: t('Credit Card') },
    { id: 'PAYPAL', name: 'PayPal' },
  ];

  // TODO: Implement other payment method (Apple Pay, Google Pay)

  let orderSummary = (
    <View style={styles.flex}>
      <Text style={[styles.labelStyle, styles.opacity]}>
        {t('Select Payment Method')}
      </Text>
      <PaymentRadioGroup
        acceptedTypes={acceptedPaymentTypes}
        selectedType={selectedPaymentType}
        onSelect={setSelectedPaymentType}
        creditCard={creditCardInfo}
        onCardValueChange={setCreditCardInfo}
      />
      <Text style={[styles.labelStyle, styles.opacity]}>
        {t('Shipping Address')}
      </Text>
      <Surface containerStyle={styles.surfaceAddress}>
        <Text style={styles.mediumText}>{address.name}</Text>
        {formatAddress(address).map((item) =>
          item ? (
            <Text key={item} style={[styles.address, styles.opacity]}>
              {item}
            </Text>
          ) : (
            <Text>{t('No Addresses To Display')}</Text>
          ),
        )}
        <Text style={[styles.address, styles.opacity]}>
          {t('Phone: {phone}', { phone: address.phone })}
        </Text>
      </Surface>
      <Text style={[styles.labelStyle, styles.opacity]}>
        {t('Order Summary')}
      </Text>
      {OrderData2.map((item) => (
        <OrderItem cardType="order" orderItem={item} key={item.variantID} />
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
      <Button style={defaultButton} labelStyle={defaultButtonLabel}>
        {t('Pay')}
      </Button>
    </View>
  );

  return isLandscape ? (
    <View style={styles.horizontalLayout}>
      <ScrollView style={styles.horizontalLayoutColumn}>
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
    >
      {orderSummary}
      {checkoutSummary}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mediumText: {
    fontSize: FONT_SIZE.medium,
  },
  flexGrow: {
    flexGrow: 1,
  },
  opacity: {
    opacity: 0.6,
  },
  address: {
    marginTop: 6,
  },
  labelStyle: {
    marginTop: 16,
    marginBottom: 6,
  },
  flex: {
    flex: 1,
  },
  verticalNarrow: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  verticalWide: {
    paddingHorizontal: 36,
    paddingTop: 8,
    marginBottom: 24,
  },
  horizontalLayout: {
    flex: 1,
    paddingHorizontal: 18,
    flexDirection: 'row',
  },
  horizontalLayoutColumn: {
    flex: 1,
    marginHorizontal: 18,
    marginBottom: 24,
  },
  surfacePrice: {
    marginTop: 14,
    marginBottom: 24,
  },
  surfaceAddress: {
    marginTop: 6,
  },
});

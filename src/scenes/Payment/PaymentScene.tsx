import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import { Button, RadioButton, Text, TextInput } from 'exoflex';

import { Surface } from '../../core-ui';
import { OrderItem } from '../../components';
import { COLORS } from '../../constants/colors';
import { FONT_SIZE } from '../../constants/fonts';
import formatAddress from '../../helpers/formatAddress';
import { OrderData2 } from '../../fixtures/OrderItemData';
import { addressItemData } from '../../fixtures/AddressItemData';
import { useDimensions, ScreenSize } from '../../helpers/dimensions';
import formatCurrency from '../../helpers/formatCurrency';
import { defaultButton, defaultButtonLabel } from '../../constants/theme';
import PaymentRadioButton from './components/PaymentRadioButton';
import { masterCard, visa } from '../../../assets/images';
import formatExpiryDate from '../../helpers/formatExpiryDate';

export default function PaymentScene() {
  let { screenSize, isLandscape } = useDimensions();
  let [selectedPayment, setSelectedPayment] = useState('Credit Card');
  let [creditCardInfo, setCreditCardInfo] = useState({
    cardNumber: '',
    name: '',
    expirationDate: '',
    cvv: '',
  });
  let subtotal = 77;
  let shipping = 0;
  let total = subtotal + shipping;
  let address = addressItemData[0];
  // TODO: Get payment settings from API

  let radioButtonStyle = (label: string) => [
    styles.radioButton,
    selectedPayment === label
      ? styles.radioButtonActive
      : styles.radioButtonInactive,
  ];

  // TODO: Probably should factor this out
  let creditCardPayment = () => {
    // TODO: Tokenize payment by sending credit card detail to Shopify Card Vault
    // TODO: Validate credit card input
    return (
      <PaymentRadioButton
        label={
          <View style={styles.creditCardLabel}>
            <Text>{t('Credit Card')}</Text>
            <View style={styles.creditCardLogoContainer}>
              <Image source={visa} style={styles.creditCardLogo} />
              <Image source={masterCard} style={styles.creditCardLogo} />
              <Text style={styles.opacity}>{t('and more')}</Text>
            </View>
          </View>
        }
        isSelected={selectedPayment === t('Credit Card')}
        onSelect={() => setSelectedPayment(t('Credit Card'))}
        style={radioButtonStyle(t('Credit Card'))}
      >
        <View style={styles.creditCardForm}>
          <TextInput
            mode="flat"
            keyboardType="number-pad"
            label={t('Card Number')}
            value={creditCardInfo.cardNumber}
            onChangeText={(cardNumber: string) =>
              // TODO: Mask credit card number
              setCreditCardInfo({ ...creditCardInfo, cardNumber })
            }
          />
          <TextInput
            mode="flat"
            label={t('Name on Card')}
            autoCapitalize="words"
            value={creditCardInfo.name}
            onChangeText={(name: string) =>
              setCreditCardInfo({ ...creditCardInfo, name })
            }
          />
          <View style={styles.flexRow}>
            <TextInput
              containerStyle={styles.expirationDate}
              mode="flat"
              keyboardType="number-pad"
              label={t('Expiration Date (MM/YY)')}
              value={creditCardInfo.expirationDate}
              onChangeText={(expirationDate) =>
                setCreditCardInfo({
                  ...creditCardInfo,
                  expirationDate: formatExpiryDate(expirationDate),
                })
              }
            />
            <TextInput
              containerStyle={styles.flex}
              mode="flat"
              secureTextEntry={true}
              keyboardType="number-pad"
              label={t('CVV')}
              value={creditCardInfo.cvv}
              onChangeText={(cvv: string) =>
                setCreditCardInfo({ ...creditCardInfo, cvv })
              }
            />
          </View>
        </View>
      </PaymentRadioButton>
    );
  };

  // TODO: Implement other payment method (Apple Pay, Google Pay)
  let orderSummary = (
    <View style={styles.flex}>
      <Text style={[styles.labelStyle, styles.opacity]}>
        {t('Select Payment Method')}
      </Text>
      <RadioButton.Group value="Payment Method">
        {creditCardPayment()}
        <PaymentRadioButton
          label={
            <View style={styles.creditCardLabel}>
              <Text>{t('PayPal')}</Text>
            </View>
          }
          isSelected={selectedPayment === t('PayPal')}
          onSelect={() => setSelectedPayment(t('PayPal'))}
          style={radioButtonStyle(t('PayPal'))}
        />
      </RadioButton.Group>

      <Text style={[styles.labelStyle, styles.opacity]}>
        {t('Shipping Address')}
      </Text>
      <Surface containerStyle={styles.surfaceAddress}>
        <Text style={styles.mediumText}>{address.name}</Text>
        {formatAddress(address).map((item) => (
          <Text key={item} style={[styles.address, styles.opacity]}>
            {item}
          </Text>
        ))}
        <Text style={[styles.address, styles.opacity]}>
          {t('Phone: {phone}', { phone: address.phone })}
        </Text>
      </Surface>
      <Text style={[styles.labelStyle, styles.opacity]}>
        {t('Order Summary')}
      </Text>
      {OrderData2.map((item) => (
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
  radioButton: {
    marginTop: 12,
    borderWidth: 1,
  },
  radioButtonInactive: {
    borderColor: COLORS.lightGrey,
  },
  radioButtonActive: {
    borderColor: COLORS.primaryColor,
  },
  opacity: {
    opacity: 0.6,
  },
  address: {
    fontSize: FONT_SIZE.small,
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
  creditCardLogo: {
    width: 30,
    height: 14,
    resizeMode: 'contain',
  },
  creditCardLabel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  creditCardLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  flexRow: {
    flexDirection: 'row',
  },
  creditCardForm: {
    marginHorizontal: 16,
    marginBottom: 22,
  },
  expirationDate: {
    flex: 1,
    marginRight: 16,
  },
});

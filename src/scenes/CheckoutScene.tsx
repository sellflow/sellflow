import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Text, RadioButton, IconButton, Button, TextInput } from 'exoflex';
import { useNavigation } from '@react-navigation/native';

import { CheckoutAddress } from '../components';
import { Surface } from '../core-ui';
import { addressItemData } from '../fixtures/AddressItemData';
import { useDimensions, ScreenSize } from '../helpers/dimensions';
import { FONT_SIZE } from '../constants/fonts';
import { COLORS } from '../constants/colors';
import formatCurrency from '../helpers/formatCurrency';
import { defaultButton, defaultButtonLabel } from '../constants/theme';
import { StackNavProp } from '../types/Navigation';
import { useAuth } from '../helpers/useAuth';
import { defaultAddress } from '../constants/defaultValue';

export default function CheckoutScene() {
  let [selectedAddress, setSelectedAddress] = useState(addressItemData[0].id);
  let { navigate } = useNavigation<StackNavProp<'Checkout'>>();
  let { authToken } = useAuth();
  let [address, setAddress] = useState(defaultAddress);

  useEffect(() => {
    let defaultAddress =
      addressItemData.find((item) => item.default === true) ||
      addressItemData[0];
    setSelectedAddress(defaultAddress.id);
  }, []);

  let { screenSize } = useDimensions();

  let containerStyle = () => {
    if (screenSize === ScreenSize.Small) {
      return styles.normal;
    } else {
      return styles.tab;
    }
  };

  let renderShippingAddress = () => {
    if (authToken) {
      return (
        <View style={styles.flex}>
          <Text style={styles.opacity}>{t('Shipping Address')}</Text>
          <RadioButton.Group value="Address List">
            <FlatList
              data={addressItemData}
              renderItem={({ item }) => (
                <CheckoutAddress
                  data={item}
                  style={styles.checkoutAddress}
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
              style={styles.addressList}
            />
          </RadioButton.Group>
        </View>
      );
    } else {
      return (
        <View style={styles.flex}>
          <Text style={[styles.opacity, styles.shippingInfo]}>
            {t('Shipping Information')}
          </Text>
          <TextInput
            label={t('Name')}
            autoFocus={true}
            clearTextOnFocus={false}
            autoCapitalize="words"
            textContentType="name"
            mode="flat"
            value={address.name}
            onChangeText={(name) => setAddress({ name, ...address })}
            returnKeyType="next"
            labelStyle={styles.textInputLabel}
            containerStyle={styles.textInput}
          />
          <TextInput
            label={t('Address 1')}
            clearTextOnFocus={false}
            autoCapitalize="none"
            textContentType="streetAddressLine1"
            mode="flat"
            value={address.address1}
            onChangeText={(address1) => setAddress({ address1, ...address })}
            returnKeyType="next"
            labelStyle={styles.textInputLabel}
            containerStyle={styles.textInput}
          />
          <TextInput
            label={t('Address 2 (optional)')}
            clearTextOnFocus={false}
            autoCapitalize="none"
            textContentType="streetAddressLine2"
            mode="flat"
            value={address.address2}
            onChangeText={(address2) => setAddress({ address2, ...address })}
            returnKeyType="next"
            labelStyle={styles.textInputLabel}
            containerStyle={styles.textInput}
          />
          <TextInput
            label={t('City')}
            clearTextOnFocus={false}
            autoCapitalize="words"
            textContentType="addressCity"
            mode="flat"
            value={address.city}
            onChangeText={(city) => setAddress({ city, ...address })}
            returnKeyType="next"
            labelStyle={styles.textInputLabel}
            containerStyle={styles.textInput}
          />
          <TextInput
            label={t('Province')}
            clearTextOnFocus={false}
            autoCapitalize="words"
            textContentType="addressState"
            mode="flat"
            value={address.province}
            onChangeText={(province) => setAddress({ province, ...address })}
            returnKeyType="next"
            labelStyle={styles.textInputLabel}
            containerStyle={styles.textInput}
          />
          <TextInput
            label={t('Country')}
            clearTextOnFocus={false}
            autoCapitalize="words"
            textContentType="countryName"
            mode="flat"
            value={address.country}
            onChangeText={(country) => setAddress({ country, ...address })}
            returnKeyType="next"
            labelStyle={styles.textInputLabel}
            containerStyle={styles.textInput}
          />
          <TextInput
            label={t('Postal Code')}
            clearTextOnFocus={false}
            textContentType="postalCode"
            keyboardType="number-pad"
            mode="flat"
            value={address.zip}
            onChangeText={(zip) => setAddress({ zip, ...address })}
            returnKeyType="next"
            labelStyle={styles.textInputLabel}
            containerStyle={styles.textInput}
          />
          <TextInput
            label={t('Phone Number')}
            clearTextOnFocus={false}
            textContentType="telephoneNumber"
            mode="flat"
            value={address.phone}
            onChangeText={(phone) => setAddress({ phone, ...address })}
            returnKeyType="done"
            labelStyle={styles.textInputLabel}
            containerStyle={styles.textInput}
          />
        </View>
      );
    }
  };

  let renderPaymentView = () => (
    <View style={screenSize === ScreenSize.Large && styles.priceViewLandscape}>
      <Surface containerStyle={styles.surfacePaymentDetails}>
        <View style={styles.paymentDetailsContainer}>
          <Text style={styles.paymentDetailLabel}>{t('Subtotal')}</Text>
          <Text style={styles.mediumText}>{formatCurrency(123)}</Text>
        </View>
        <View style={styles.paymentDetailsContainer}>
          <Text style={styles.paymentDetailLabel}>{t('Shipping')}</Text>
          <Text style={styles.mediumText}>{formatCurrency(123)}</Text>
        </View>
        <View style={[styles.paymentDetailsContainer, styles.totalBorder]}>
          <Text style={styles.paymentDetailLabel}>{t('Total')}</Text>
          <Text weight="bold" style={styles.mediumText}>
            {formatCurrency(246)}
          </Text>
        </View>
      </Surface>
      <Button
        style={[defaultButton, styles.verticalMargin]}
        labelStyle={defaultButtonLabel}
        onPress={() => navigate('Payment')}
      >
        {t('Proceed to payment')}
      </Button>
    </View>
  );

  if (authToken) {
    return (
      <SafeAreaView style={[styles.container, containerStyle()]}>
        {renderShippingAddress()}
        {renderPaymentView()}
      </SafeAreaView>
    );
  } else if (screenSize === ScreenSize.Large) {
    return (
      <SafeAreaView style={[styles.flex, styles.landscape, containerStyle()]}>
        <ScrollView style={styles.flex} contentContainerStyle={styles.flexGrow}>
          {renderShippingAddress()}
        </ScrollView>
        {renderPaymentView()}
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.flex}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[containerStyle(), styles.flexGrow]}
        >
          {renderShippingAddress()}
          {renderPaymentView()}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  flexGrow: { flexGrow: 1 },
  mediumText: { fontSize: FONT_SIZE.medium },
  newAddressButton: {
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
  opacity: { opacity: 0.6 },
  addressList: {
    marginTop: 12,
    marginBottom: 24,
  },
  checkoutAddress: { marginBottom: 12 },
  verticalMargin: { marginTop: 24 },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  normal: {
    marginHorizontal: 24,
    marginTop: 16,
  },
  tab: {
    marginHorizontal: 36,
    marginTop: 24,
  },
  landscape: { flexDirection: 'row' },
  priceViewLandscape: {
    flex: 1,
    marginLeft: 24,
  },
  surfacePaymentDetails: { paddingHorizontal: 15 },
  paymentDetailsContainer: {
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentDetailLabel: {
    fontSize: FONT_SIZE.medium,
    marginBottom: 6,
  },
  textInput: { marginBottom: 24 },
  textInputLabel: { fontSize: FONT_SIZE.small },
  totalBorder: {
    borderTopWidth: 1,
    borderColor: COLORS.lightGrey,
  },
  shippingInfo: { marginBottom: 16 },
});

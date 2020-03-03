import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { Text, RadioButton, IconButton, Button, TextInput } from 'exoflex';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';

import { CheckoutAddress } from '../components';
import { Surface } from '../core-ui';
import { addressItemData } from '../fixtures/AddressItemData';
import { useDimensions, ScreenSize } from '../helpers/dimensions';
import { FONT_SIZE } from '../constants/fonts';
import { COLORS } from '../constants/colors';
import formatCurrency from '../helpers/formatCurrency';
import { defaultButton, defaultButtonLabel } from '../constants/theme';
import { StackNavProp, StackRouteProp } from '../types/Navigation';
import { useAuth } from '../helpers/useAuth';
import { emptyAddress } from '../constants/defaultValues';
import { AddressItem, PaymentInfo, ShippingLine } from '../types/types';
import { useGetCustomerData } from '../hooks/api/useCustomer';
import { useShopifyCartUpdateAddress } from '../hooks/api/useShopifyCart';

export default function CheckoutScene() {
  let { navigate } = useNavigation<StackNavProp<'Checkout'>>();
  let { params } = useRoute<StackRouteProp<'Checkout'>>();
  let { id: cartId } = params.cartData;
  let [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    subtotalPrice: params.cartData.subtotalPrice,
    totalPrice: params.cartData.totalPrice,
    shippingLines: [],
  });
  let { subtotalPrice, totalPrice } = paymentInfo;
  let { authToken } = useAuth();
  let [address, setAddress] = useState<AddressItem>(emptyAddress); // can be used to do the update
  let [addressAvailable, setAddressAvailable] = useState<Array<AddressItem>>(
    [],
  );
  let [selectedAddress, setSelectedAddress] = useState<AddressItem>(
    addressItemData[0],
  );

  let {
    updateCartAddress,
    data: updateAddressData,
  } = useShopifyCartUpdateAddress({
    onCompleted: ({ checkoutShippingAddressUpdateV2 }) => {
      if (
        checkoutShippingAddressUpdateV2 &&
        checkoutShippingAddressUpdateV2.checkout
      ) {
        let {
          totalPriceV2,
          availableShippingRates,
          subtotalPriceV2,
        } = checkoutShippingAddressUpdateV2.checkout;
        let allShippingLine: Array<ShippingLine> = [];
        if (availableShippingRates && availableShippingRates.shippingRates) {
          allShippingLine = availableShippingRates.shippingRates.map(
            ({ title, handle, priceV2 }): ShippingLine => {
              return {
                amount: Number(priceV2.amount),
                handle,
                title,
              };
            },
          );
        }

        setPaymentInfo({
          ...paymentInfo,
          subtotalPrice: Number(subtotalPriceV2.amount),
          totalPrice: Number(totalPriceV2.amount),
          shippingLines: allShippingLine,
        });
      }
    },
  });

  let { getCustomer, customerAddressData } = useGetCustomerData({
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ customer }) => {
      if (customer && customer.defaultAddress) {
        let addresses = customerAddressData;
        setAddressAvailable(addresses);
      }
    },
  });

  let focusEffect = useCallback(() => {
    getCustomer({
      variables: { accessToken: authToken },
    });

    return undefined;
  }, [getCustomer, authToken]);
  useFocusEffect(focusEffect);

  useEffect(() => {
    let defaultAddress =
      addressAvailable.find((item) => item.default === true) ||
      addressItemData[0];
    setSelectedAddress(defaultAddress);
  }, [addressAvailable]);

  let updateAddress = async (
    address: AddressItem,
    doWhenSuccess?: () => void,
  ) => {
    let { id, name, default: defaultStatus, ...usedAddress } = address;
    await updateCartAddress({
      variables: { checkoutId: cartId, shippingAddress: { ...usedAddress } },
    });
    if (
      doWhenSuccess &&
      updateAddressData &&
      updateAddressData.checkoutShippingAddressUpdateV2
    ) {
      let {
        checkoutUserErrors,
      } = updateAddressData.checkoutShippingAddressUpdateV2;
      if (checkoutUserErrors.length === 0) {
        doWhenSuccess();
      } else {
        Alert.alert(t('Please insert a valid address'));
      }
    }
  };

  let { screenSize } = useDimensions();

  let containerStyle = () => {
    if (screenSize === ScreenSize.Small) {
      return styles.normal;
    } else {
      return styles.tab;
    }
  };
  let addNewAddress = () => {
    navigate('AddEditAddress', { rootScene: 'Checkout' });
  };

  let onPressEdit = (address: AddressItem) => {
    navigate('AddEditAddress', { address, rootScene: 'Checkout' });
  };

  let onSelect = async (item: AddressItem) => {
    setSelectedAddress(item);
    await updateAddress(item);
  };

  let onProceedPressed = async () => {
    if (authToken) {
      await updateAddress(selectedAddress, () => navigate('Payment'));
    } else {
      await updateAddress(address, () => navigate('Payment'));
    }
  };
  let isDisabled = authToken
    ? false
    : !address.address1 ||
      !address.city ||
      !address.country ||
      !address.firstName ||
      !address.lastName ||
      !address.phone ||
      !address.province ||
      !address.zip;

  let renderShippingAddress = () => {
    if (authToken) {
      return (
        <View style={styles.flex}>
          <Text style={styles.opacity}>{t('Shipping Address')}</Text>
          <RadioButton.Group value="Address List">
            <FlatList
              data={addressAvailable}
              renderItem={({ item }) => (
                <CheckoutAddress
                  data={item}
                  style={styles.checkoutAddress}
                  isSelected={selectedAddress.id === item.id}
                  onSelect={() => onSelect(item)}
                  onEditPressed={() => onPressEdit(item)}
                />
              )}
              keyExtractor={(data) => data.id.toString()}
              ListFooterComponent={() => (
                <TouchableOpacity
                  onPress={addNewAddress}
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
        <View>
          <Text style={[styles.opacity, styles.shippingInfo]}>
            {t('Shipping Information')}
          </Text>
          <TextInput
            label={t('First name')}
            autoFocus={true}
            clearTextOnFocus={false}
            autoCapitalize="words"
            textContentType="name"
            mode="flat"
            value={address.firstName}
            onChangeText={(firstName) => setAddress({ ...address, firstName })}
            returnKeyType="next"
            labelStyle={styles.textInputLabel}
            containerStyle={styles.textInput}
          />
          <TextInput
            label={t('Last Name')}
            clearTextOnFocus={false}
            autoCapitalize="words"
            textContentType="name"
            mode="flat"
            value={address.lastName}
            onChangeText={(lastName) => setAddress({ ...address, lastName })}
            returnKeyType="next"
            labelStyle={styles.textInputLabel}
            containerStyle={styles.textInput}
          />
          <TextInput
            label={t('Address 1')}
            clearTextOnFocus={false}
            autoCapitalize="words"
            textContentType="streetAddressLine1"
            mode="flat"
            value={address.address1}
            onChangeText={(address1) => setAddress({ ...address, address1 })}
            returnKeyType="next"
            labelStyle={styles.textInputLabel}
            containerStyle={styles.textInput}
          />
          <TextInput
            label={t('Address 2 (optional)')}
            clearTextOnFocus={false}
            autoCapitalize="words"
            textContentType="streetAddressLine2"
            mode="flat"
            value={address.address2}
            onChangeText={(address2) => setAddress({ ...address, address2 })}
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
            onChangeText={(city) => setAddress({ ...address, city })}
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
            onChangeText={(province) => setAddress({ ...address, province })}
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
            onChangeText={(country) => setAddress({ ...address, country })}
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
            onChangeText={(zip) => setAddress({ ...address, zip })}
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
            onChangeText={(phone) => setAddress({ ...address, phone })}
            returnKeyType="done"
            labelStyle={styles.textInputLabel}
            containerStyle={styles.textInput}
            keyboardType="number-pad"
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
          <Text style={styles.mediumText}>{formatCurrency(subtotalPrice)}</Text>
        </View>
        <View style={styles.paymentDetailsContainer}>
          <Text style={styles.paymentDetailLabel}>{t('Shipping')}</Text>
          <Text style={styles.mediumText}>{t('Calculated at next step')}</Text>
        </View>
        <View style={[styles.paymentDetailsContainer, styles.totalBorder]}>
          <Text style={styles.paymentDetailLabel}>{t('Total')}</Text>
          <Text weight="bold" style={styles.mediumText}>
            {formatCurrency(totalPrice)}
          </Text>
        </View>
      </Surface>
      <Button
        style={[defaultButton, styles.proceedButtonStyle]}
        labelStyle={defaultButtonLabel}
        onPress={onProceedPressed}
        disabled={isDisabled}
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
        <KeyboardAvoidingView
          behavior="padding"
          style={styles.flex}
          keyboardVerticalOffset={60}
        >
          <ScrollView style={styles.flex}>{renderShippingAddress()}</ScrollView>
        </KeyboardAvoidingView>
        {renderPaymentView()}
      </SafeAreaView>
    );
  } else {
    return (
      <View style={styles.flex}>
        <KeyboardAvoidingView
          behavior="padding"
          style={styles.flex}
          keyboardVerticalOffset={60}
        >
          <ScrollView
            style={styles.flex}
            contentContainerStyle={containerStyle()}
          >
            {renderShippingAddress()}
            {renderPaymentView()}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
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
  proceedButtonStyle: { marginBottom: 24 },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  normal: {
    marginHorizontal: 24,
    paddingTop: 16,
  },
  tab: {
    marginHorizontal: 36,
    paddingTop: 24,
  },
  landscape: { flexDirection: 'row' },
  priceViewLandscape: {
    flex: 1,
    marginLeft: 24,
  },
  surfacePaymentDetails: { paddingHorizontal: 15, marginBottom: 24 },
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

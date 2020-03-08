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
  AppState,
  AppStateStatus,
} from 'react-native';
import { Text, RadioButton, IconButton, Button } from 'exoflex';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import { Linking } from 'expo';

import { CheckoutAddress } from '../../components';
import { Surface } from '../../core-ui';
import { addressItemData } from '../../fixtures/AddressItemData';
import { useDimensions, ScreenSize } from '../../helpers/dimensions';
import { FONT_SIZE } from '../../constants/fonts';
import { COLORS } from '../../constants/colors';
import { defaultButton, defaultButtonLabel } from '../../constants/theme';
import { StackNavProp, StackRouteProp } from '../../types/Navigation';
import { useAuth } from '../../helpers/useAuth';
import { emptyAddress } from '../../constants/defaultValues';
import { AddressItem, PaymentInfo } from '../../types/types';
import {
  useGetCustomerData,
  useGetCustomerAddresses,
} from '../../hooks/api/useCustomer';
import { useCheckoutUpdateAddress } from '../../hooks/api/useShopifyCart';
import { ShippingAddressForm } from './components';
import { useResetCart } from '../../hooks/api/useShoppingCart';
import useCurrencyFormatter from '../../hooks/api/useCurrencyFormatter';

export default function CheckoutScene() {
  let { navigate } = useNavigation<StackNavProp<'Checkout'>>();
  let { params } = useRoute<StackRouteProp<'Checkout'>>();

  let { id: cartId } = params.cartData;
  let [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    subtotalPrice: params.cartData.subtotalPrice,
    totalPrice: params.cartData.totalPrice,
  });
  let { subtotalPrice, totalPrice } = paymentInfo;
  let { authToken } = useAuth();
  let [address, setAddress] = useState<AddressItem>(emptyAddress); // can be used to do the update
  let [selectedAddress, setSelectedAddress] = useState<AddressItem>(
    addressItemData[0],
  );
  let { screenSize } = useDimensions();
  const first = 5;
  let formatCurrency = useCurrencyFormatter();

  let { resetShoppingCart } = useResetCart();

  let { updateCartAddress, data: updateAddressData } = useCheckoutUpdateAddress(
    {
      onCompleted: ({ checkoutShippingAddressUpdateV2 }) => {
        if (
          checkoutShippingAddressUpdateV2 &&
          checkoutShippingAddressUpdateV2.checkout
        ) {
          let {
            totalPriceV2,
            subtotalPriceV2,
          } = checkoutShippingAddressUpdateV2.checkout;

          setPaymentInfo({
            ...paymentInfo,
            subtotalPrice: Number(subtotalPriceV2.amount),
            totalPrice: Number(totalPriceV2.amount),
          });
        }
      },
    },
  );

  let { getCustomer, data: customerData } = useGetCustomerData();

  let { addresses, refetch: refetchAddress } = useGetCustomerAddresses(
    first,
    authToken,
  );

  useFocusEffect(
    useCallback(() => {
      refetchAddress('update', { first, customerAccessToken: authToken });

      return undefined;
    }, []), // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    let defaultAddress =
      addresses.find((item) => item.default === true) || addressItemData[0];
    setSelectedAddress(defaultAddress);

    if (customerData && customerData.customer) {
      if (!customerData.customer.lastIncompleteCheckout) {
        resetShoppingCart();
        navigate('Home'); // TODO: Navigate to Order Confirmation scene
      }
    }
  }, [addresses, customerData]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let handleAppStateChange = (appState: AppStateStatus) => {
      if (appState === 'active') {
        getCustomer({
          variables: { accessToken: authToken },
        });
      }
    };
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  let updateAddress = async (
    address: AddressItem,
    doWhenSuccess?: (webUrl: string) => void,
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
        doWhenSuccess(
          updateAddressData.checkoutShippingAddressUpdateV2.checkout?.webUrl,
        );
      } else {
        Alert.alert(t('Please insert a valid address'));
      }
    }
  };

  let navigateToPayment = (webUrl: string) => {
    Linking.openURL(webUrl);
  };

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
      await updateAddress(selectedAddress, navigateToPayment);
    } else {
      await updateAddress(address, navigateToPayment);
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
              data={addresses}
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
        <ShippingAddressForm address={address} onChangeAddress={setAddress} />
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
  totalBorder: {
    borderTopWidth: 1,
    borderColor: COLORS.lightGrey,
  },
});

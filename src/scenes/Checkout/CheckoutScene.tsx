import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  AppState,
  AppStateStatus,
} from 'react-native';
import { Text, RadioButton, IconButton, Button, Portal } from 'exoflex';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';

import { CheckoutAddress, ModalBottomSheetMessage } from '../../components';
import { Surface, ModalBottomSheet } from '../../core-ui';
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
import useCurrencyFormatter from '../../hooks/api/useCurrencyFormatter';

export default function CheckoutScene() {
  let { navigate } = useNavigation<StackNavProp<'Checkout'>>();
  let { params } = useRoute<StackRouteProp<'Checkout'>>();

  let { id: cartId } = params.cartData;
  let [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    subtotalPrice: params.cartData.subtotalPrice,
    totalPrice: params.cartData.totalPrice,
  });
  let { subtotalPrice } = paymentInfo;
  let { authToken } = useAuth();
  let [address, setAddress] = useState<AddressItem>(emptyAddress); // can be used to do the update
  let [selectedAddress, setSelectedAddress] = useState<AddressItem>(
    addressItemData[0],
  );
  let [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  let { screenSize } = useDimensions();
  const first = 5;
  let formatCurrency = useCurrencyFormatter();

  let toggleModalVisible = () => setIsModalVisible(!isModalVisible);

  let { updateCartAddress, data: updateAddressData } = useCheckoutUpdateAddress(
    {
      onCompleted: ({ checkoutShippingAddressUpdateV2 }) => {
        if (
          checkoutShippingAddressUpdateV2 &&
          checkoutShippingAddressUpdateV2.checkout
        ) {
          let { subtotalPriceV2 } = checkoutShippingAddressUpdateV2.checkout;

          setPaymentInfo({
            ...paymentInfo,
            subtotalPrice: Number(subtotalPriceV2.amount),
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
  }, [addresses, customerData]);

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

  useEffect(() => {
    if (updateAddressData?.checkoutShippingAddressUpdateV2) {
      let {
        checkoutUserErrors,
      } = updateAddressData.checkoutShippingAddressUpdateV2;
      if (checkoutUserErrors.length === 0) {
        navigateToPayment(
          updateAddressData.checkoutShippingAddressUpdateV2.checkout?.webUrl,
        );
      } else {
        toggleModalVisible();
      }
    }
  }, [updateAddressData]); // eslint-disable-line react-hooks/exhaustive-deps

  let updateAddress = async (address: AddressItem) => {
    let { id, name, default: defaultStatus, cursor, ...usedAddress } = address;

    await updateCartAddress({
      variables: {
        checkoutId: cartId,
        shippingAddress: {
          ...usedAddress,
        },
      },
    });
  };

  let navigateToPayment = (webUrl: string) => {
    navigate('WebView', { webUrl, type: 'payment' });
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
      await updateAddress(selectedAddress);
    } else {
      await updateAddress(address);
    }
  };

  let isDisabled = authToken
    ? selectedAddress === addressItemData[0] || false
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
            {formatCurrency(subtotalPrice)}
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
  let renderBottomModal = () => (
    <Portal>
      <ModalBottomSheet
        title={t('An Error Occured!')}
        isModalVisible={isModalVisible}
        toggleModal={toggleModalVisible}
      >
        <ModalBottomSheetMessage
          isError={true}
          message={t('Please insert a valid address')}
          onPressModalButton={toggleModalVisible}
          buttonText={t('Close')}
        />
      </ModalBottomSheet>
    </Portal>
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
        {renderBottomModal()}
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
        {renderBottomModal()}
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
  opacity: { opacity: 0.6, marginTop: 16 },
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
    marginTop: 24,
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

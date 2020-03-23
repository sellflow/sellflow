import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Text, Button } from 'exoflex';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';

import { ModalBottomSheetMessage } from '../../components';
import { Surface, ModalBottomSheet, KeyboardAvoidingView } from '../../core-ui';
import { addressItemData } from '../../fixtures/AddressItemData';
import { useDimensions, ScreenSize } from '../../helpers/dimensions';
import { FONT_SIZE } from '../../constants/fonts';
import { COLORS } from '../../constants/colors';
import { defaultButton, defaultButtonLabel } from '../../constants/theme';
import { StackNavProp, StackRouteProp } from '../../types/Navigation';
import { useAuth } from '../../helpers/useAuth';
import { emptyAddress } from '../../constants/defaultValues';
import { AddressItem, PaymentInfo } from '../../types/types';
import { useGetCustomerAddresses } from '../../hooks/api/useCustomer';
import { useCheckoutUpdateAddress } from '../../hooks/api/useShopifyCart';
import { ShippingAddressForm, AddressList } from './components';
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
  let [address, setAddress] = useState<AddressItem>(emptyAddress);
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

  let {
    addresses,
    refetch: refetchAddresses,
    hasMore,
    isFetchingMore,
  } = useGetCustomerAddresses(first, authToken);

  useFocusEffect(
    useCallback(() => {
      refetchAddresses('update', { first, customerAccessToken: authToken });

      return undefined;
    }, []), // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    let defaultAddress =
      addresses.find((item) => item.default === true) || addressItemData[0];
    setSelectedAddress(defaultAddress);
  }, [addresses]);

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

  let onEndReached = ({ distanceFromEnd }: { distanceFromEnd: number }) => {
    if (distanceFromEnd > 0 && !isFetchingMore && hasMore) {
      refetchAddresses('scroll', {
        first,
        customerAccessToken: authToken,
        after: addresses[addresses.length - 1].cursor || null,
      });
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
          <AddressList
            addresses={addresses}
            selectedAddress={selectedAddress}
            onEditAddress={onPressEdit}
            onSelectAddress={onSelect}
            onEndReached={onEndReached}
            hasMore={hasMore}
          />
          <Button
            preset="secondary"
            style={[defaultButton, styles.newAddressButton]}
            uppercase={false}
            icon="plus"
            labelStyle={defaultButtonLabel}
            onPress={addNewAddress}
          >
            {t('Add New Address')}
          </Button>
        </View>
      );
    } else {
      return (
        <ShippingAddressForm address={address} onChangeAddress={setAddress} />
      );
    }
  };

  let renderPaymentView = () => (
    <View
      style={
        screenSize === ScreenSize.Large && [
          styles.flex,
          styles.priceViewLandscape,
        ]
      }
    >
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
  );

  if (authToken) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          containerStyle(),
          screenSize === ScreenSize.Large && styles.landscape,
        ]}
      >
        {renderShippingAddress()}
        {renderPaymentView()}
      </SafeAreaView>
    );
  } else if (screenSize === ScreenSize.Large) {
    return (
      <KeyboardAvoidingView>
        <SafeAreaView style={[styles.flex, styles.landscape, containerStyle()]}>
          {renderBottomModal()}
          <ScrollView style={styles.flex}>{renderShippingAddress()}</ScrollView>
          {renderPaymentView()}
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  } else {
    return (
      <KeyboardAvoidingView>
        <View style={styles.flex}>
          {renderBottomModal()}
          <ScrollView
            style={styles.flex}
            contentContainerStyle={containerStyle()}
          >
            {renderShippingAddress()}
            {renderPaymentView()}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  mediumText: { fontSize: FONT_SIZE.medium },
  opacity: { opacity: 0.6, marginTop: 16 },
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
  priceViewLandscape: { marginLeft: 24 },
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
  newAddressButton: {
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    marginTop: 12,
    marginBottom: 24,
  },
});

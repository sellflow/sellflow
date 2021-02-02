import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput as TextInputType,
  TouchableOpacity,
} from 'react-native';
import { Text, TextInput, Button, ActivityIndicator } from 'exoflex';
import { useNavigation, useRoute } from '@react-navigation/native';

import { FONT_SIZE } from '../../constants/fonts';
import { COLORS } from '../../constants/colors';
import { StackNavProp, StackRouteProp } from '../../types/Navigation';
import {
  useCustomerAddNewAddress,
  useCustomerEditAddress,
  useCustomerAddressDelete,
} from '../../hooks/api/useCustomerAddress';
import {
  defaultButton,
  defaultButtonLabel,
  flatTextInputContainerStyle,
  flatTextInputStyle,
  textInputLabel,
} from '../../constants/theme';
import { useAuth } from '../../helpers/useAuth';
import { CountryModal, ModalBottomSheetMessage } from '../../components';
import { ModalBottomSheet, KeyboardAvoidingView } from '../../core-ui';
import { AddressItem } from '../../types/types';
import { newAddress } from '../../constants/defaultValues';

import { DeleteAddressModal } from './components';

export default function AddEditAddressScene() {
  let { authToken: customerAccessToken } = useAuth();
  let { navigate, setOptions } = useNavigation<
    StackNavProp<'AddEditAddress'>
  >();
  let route = useRoute<StackRouteProp<'AddEditAddress'>>();
  let { address, rootScene } = route.params;

  let [isDeleteModalVisible, setIsDeleteModalVisible] = useState<boolean>(
    false,
  );
  let [isCountryModalVisible, setIsCountryModalVisible] = useState<boolean>(
    false,
  );
  let [addressData, setAddressData] = useState<
    Omit<AddressItem, 'id' | 'name'>
  >(newAddress);
  let [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  let [errorMessage, setErrorMessage] = useState<string>('');
  let [bottomButtonHeight, setBottomButtonHeight] = useState<number>(0);

  let isAddressDataEmpty =
    addressData.address1 === '' ||
    addressData.city === '' ||
    addressData.country === '' ||
    addressData.firstName === '' ||
    addressData.lastName === '' ||
    addressData.phone === '' ||
    addressData.province === '' ||
    addressData.zip === '';

  let lastNameRef = useRef<TextInputType>(null);
  let address1Ref = useRef<TextInputType>(null);
  let provinceRef = useRef<TextInputType>(null);
  let cityRef = useRef<TextInputType>(null);
  let zipRef = useRef<TextInputType>(null);
  let phoneRef = useRef<TextInputType>(null);

  let {
    addNewAddress,
    loading: loadingAddNewAddress,
  } = useCustomerAddNewAddress();

  let { editAddress, loading: loadingEditAddress } = useCustomerEditAddress({
    onCompleted: () => {
      navigate(rootScene);
    },
  });

  let toggleModalVisible = () => setIsModalVisible(!isModalVisible);

  let {
    customerAddressDelete,
    loading: loadingDeleteAddress,
  } = useCustomerAddressDelete({
    onCompleted: () => {
      navigate(rootScene);
    },
  });

  useEffect(() => {
    if (address) {
      setAddressData({
        firstName: address.firstName,
        lastName: address.lastName,
        address1: address.address1,
        city: address.city,
        province: address.province,
        zip: address.zip,
        country: address.country,
        phone: address.phone,
      });
    }
  }, [address]);

  let toggleDeleteModal = () => {
    setIsDeleteModalVisible(!isDeleteModalVisible);
  };

  let toggleCountryModal = () => {
    setIsCountryModalVisible(!isCountryModalVisible);
  };

  let onPressCancel = () => {
    toggleDeleteModal();
  };

  let onPressDelete = () => {
    toggleDeleteModal();
    customerAddressDelete({
      variables: { id: address?.id ?? '', customerAccessToken },
    });
  };

  let onPressCountry = (country: string) => {
    toggleCountryModal();
    setAddressData({ ...addressData, country });
    provinceRef.current && provinceRef.current.focus();
  };

  let onPressSaveAddress = async () => {
    if (address === undefined) {
      let result = await addNewAddress({
        variables: {
          customerAccessToken,
          address: addressData,
        },
      });

      let customerUserErrors =
        result?.data?.customerAddressCreate?.customerUserErrors;

      if (customerUserErrors && customerUserErrors.length > 0) {
        setErrorMessage(customerUserErrors[0].message);
        toggleModalVisible();
      } else {
        navigate(rootScene);
      }
    } else {
      let result = await editAddress({
        variables: {
          id: address?.id ?? '',
          customerAccessToken,
          address: addressData,
        },
      });

      let customerUserErrors =
        result?.data?.customerAddressUpdate?.customerUserErrors;

      if (customerUserErrors && customerUserErrors.length > 0) {
        setErrorMessage(customerUserErrors[0].message);
        toggleModalVisible();
      } else {
        navigate(rootScene);
      }
    }
  };

  setOptions({
    title: address == null ? t('New Address') : t('Edit Address'),
    headerRight: () => {
      return address != null ? (
        <Text
          weight="medium"
          style={styles.headerRightText}
          onPress={toggleDeleteModal}
        >
          {t('Delete')}
        </Text>
      ) : null;
    },
  });

  if (loadingDeleteAddress) {
    return <ActivityIndicator style={styles.centered} />;
  }

  return (
    <View style={styles.flex}>
      <ModalBottomSheet
        title={t('An Error Occured!')}
        isModalVisible={isModalVisible}
        toggleModal={toggleModalVisible}
      >
        <ModalBottomSheetMessage
          isError={true}
          message={errorMessage}
          onPressModalButton={toggleModalVisible}
          buttonText={t('Close')}
        />
      </ModalBottomSheet>
      <KeyboardAvoidingView keyboardVerticalOffset={-bottomButtonHeight}>
        <DeleteAddressModal
          deleteVisible={isDeleteModalVisible}
          toggleModal={toggleDeleteModal}
          onPressCancel={onPressCancel}
          onPressDelete={onPressDelete}
        />
        <CountryModal
          countryVisible={isCountryModalVisible}
          toggleModal={toggleCountryModal}
          onPressCountry={onPressCountry}
        />
        <ScrollView
          style={styles.paddingHorizontal}
          showsVerticalScrollIndicator={false}
        >
          <TextInput
            onSubmitEditing={() => {
              lastNameRef.current && lastNameRef.current.focus();
            }}
            returnKeyType="next"
            mode="flat"
            label={t('First Name')}
            labelStyle={textInputLabel}
            value={addressData.firstName}
            onChangeText={(firstName) =>
              setAddressData({ ...addressData, firstName })
            }
            containerStyle={flatTextInputContainerStyle}
            style={flatTextInputStyle}
          />
          <TextInput
            onSubmitEditing={() => {
              address1Ref.current && address1Ref.current.focus();
            }}
            ref={lastNameRef}
            returnKeyType="next"
            mode="flat"
            label={t('Last Name')}
            labelStyle={textInputLabel}
            value={addressData.lastName}
            onChangeText={(lastName) =>
              setAddressData({ ...addressData, lastName })
            }
            containerStyle={flatTextInputContainerStyle}
            style={flatTextInputStyle}
          />
          <TextInput
            onSubmitEditing={toggleCountryModal}
            returnKeyType="next"
            ref={address1Ref}
            mode="flat"
            label={t('Address')}
            labelStyle={textInputLabel}
            value={addressData.address1}
            onChangeText={(address1) =>
              setAddressData({ ...addressData, address1 })
            }
            containerStyle={flatTextInputContainerStyle}
            style={flatTextInputStyle}
            autoCapitalize="words"
          />
          <TouchableOpacity onPress={toggleCountryModal}>
            <TextInput
              mode="flat"
              label={t('Country')}
              labelStyle={textInputLabel}
              value={addressData.country}
              pointerEvents="none"
              editable={false}
              containerStyle={flatTextInputContainerStyle}
              style={flatTextInputStyle}
            />
          </TouchableOpacity>
          <TextInput
            onSubmitEditing={() => {
              cityRef.current && cityRef.current.focus();
            }}
            returnKeyType="next"
            ref={provinceRef}
            mode="flat"
            label={t('State / Province')}
            labelStyle={textInputLabel}
            value={addressData.province}
            onChangeText={(province) =>
              setAddressData({ ...addressData, province })
            }
            containerStyle={flatTextInputContainerStyle}
            style={flatTextInputStyle}
            autoCapitalize="words"
          />
          <TextInput
            onSubmitEditing={() => {
              zipRef.current && zipRef.current.focus();
            }}
            returnKeyType="next"
            ref={cityRef}
            mode="flat"
            label={t('City')}
            labelStyle={textInputLabel}
            value={addressData.city}
            onChangeText={(city) => setAddressData({ ...addressData, city })}
            containerStyle={flatTextInputContainerStyle}
            style={flatTextInputStyle}
            autoCapitalize="words"
          />
          <TextInput
            onSubmitEditing={() => {
              phoneRef.current && phoneRef.current.focus();
            }}
            returnKeyType="next"
            ref={zipRef}
            mode="flat"
            label={t('Postal / Zip Code')}
            labelStyle={textInputLabel}
            value={addressData.zip}
            onChangeText={(zip) => setAddressData({ ...addressData, zip })}
            containerStyle={flatTextInputContainerStyle}
            style={flatTextInputStyle}
          />
          <TextInput
            returnKeyType="done"
            ref={phoneRef}
            mode="flat"
            label={t('Phone Number')}
            labelStyle={textInputLabel}
            value={addressData.phone}
            onChangeText={(phone) => setAddressData({ ...addressData, phone })}
            keyboardType="number-pad"
            textContentType="telephoneNumber"
            containerStyle={flatTextInputContainerStyle}
            style={flatTextInputStyle}
          />
        </ScrollView>
      </KeyboardAvoidingView>
      <View
        onLayout={({ nativeEvent }) =>
          setBottomButtonHeight(nativeEvent.layout.height)
        }
      >
        <Button
          style={[defaultButton, styles.buttonStyle]}
          labelStyle={defaultButtonLabel}
          onPress={onPressSaveAddress}
          disabled={isAddressDataEmpty}
          loading={loadingAddNewAddress || loadingEditAddress}
        >
          <Text weight="medium" style={styles.buttonText}>
            {!loadingAddNewAddress && !loadingEditAddress && t('Save Address')}
          </Text>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paddingHorizontal: {
    marginTop: 14,
    paddingHorizontal: 24,
  },
  headerRightText: {
    marginRight: 24,
    fontSize: FONT_SIZE.medium,
    color: COLORS.red,
  },
  buttonStyle: {
    margin: 24,
  },
  buttonText: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.white,
    textTransform: 'uppercase',
  },
});

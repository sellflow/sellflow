import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  TextInput as TextInputType,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  Portal,
  Modal,
} from 'exoflex';
import { useNavigation, useRoute } from '@react-navigation/native';

import { FONT_SIZE } from '../../constants/fonts';
import { COLORS } from '../../constants/colors';
import { StackNavProp, StackRouteProp } from '../../types/Navigation';
import {
  useCustomerAddNewAddress,
  useCustomerEditAddress,
  useCustomerAddressDelete,
} from '../../hooks/api/useCustomerAddress';
import { defaultButton, defaultButtonLabel } from '../../constants/theme';

export default function AddEditAddressScene() {
  let { navigate, setOptions } = useNavigation<
    StackNavProp<'AddEditAddress'>
  >();
  let route = useRoute<StackRouteProp<'AddEditAddress'>>();
  let { address, customerAccessToken } = route.params;

  let [isVisible, setVisible] = useState(false);
  let [addressData, setAddressData] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    country: '',
    province: '',
    city: '',
    zip: '',
    phone: '',
  });

  let lastNameRef = useRef<TextInputType>(null);
  let address1Ref = useRef<TextInputType>(null);
  let countryRef = useRef<TextInputType>(null);
  let provinceRef = useRef<TextInputType>(null);
  let cityRef = useRef<TextInputType>(null);
  let zipRef = useRef<TextInputType>(null);
  let phoneRef = useRef<TextInputType>(null);

  let {
    addNewAddress,
    loading: loadingAddNewAddress,
  } = useCustomerAddNewAddress({
    onError: (error) => {
      Alert.alert(error.message);
    },
  });

  let { editAddress, loading: loadingEditAddress } = useCustomerEditAddress({
    onError: (error) => {
      Alert.alert(error.message);
    },
  });

  let {
    customerAddressDelete,
    loading: loadingDeleteAddress,
  } = useCustomerAddressDelete({
    onError: (error) => {
      Alert.alert(error.message);
    },
    onCompleted: () => {
      navigate('AddressManagement');
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

  let onPressCancel = () => {
    setVisible(!isVisible);
  };

  let onPressDelete = () => {
    setVisible(!isVisible);
    customerAddressDelete({
      variables: { id: address?.id ?? '', customerAccessToken },
    });
  };

  let onPressSaveAddress = async () => {
    if (address == null) {
      let result = await addNewAddress({
        variables: {
          customerAccessToken,
          address: addressData,
        },
      });

      let customerUserErrors =
        result?.data?.customerAddressCreate?.customerUserErrors;

      if (customerUserErrors && customerUserErrors.length > 0) {
        Alert.alert(customerUserErrors[0].message);
      } else {
        navigate('AddressManagement');
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
        Alert.alert(customerUserErrors[0].message);
      } else {
        navigate('AddressManagement');
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
          onPress={() => setVisible(!isVisible)}
        >
          {t('Delete')}
        </Text>
      ) : null;
    },
  });

  if (loadingDeleteAddress) {
    return <ActivityIndicator size="large" style={styles.centered} />;
  }

  return (
    <View style={styles.flex}>
      <KeyboardAvoidingView
        enabled
        behavior="padding"
        style={styles.flex}
        keyboardVerticalOffset={60}
      >
        <Portal>
          <Modal
            contentContainerStyle={styles.modal}
            visible={isVisible}
            onDismiss={() => setVisible(!isVisible)}
          >
            <View style={styles.modalTitleContainer}>
              <Text weight="medium" style={styles.modalTitle}>
                {t('Delete Address')}
              </Text>
            </View>
            <Text style={styles.message}>
              {t(
                'Are you sure you want to delete this address? This action cannot be undone',
              )}
            </Text>
            <View style={styles.modalOptionContainer}>
              <Text
                weight="medium"
                style={styles.modalCancel}
                onPress={onPressCancel}
              >
                {t('No, Cancel')}
              </Text>

              <Text
                weight="medium"
                style={styles.modalDelete}
                onPress={onPressDelete}
              >
                {t('Yes, Delete')}
              </Text>
            </View>
          </Modal>
        </Portal>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <TextInput
            onSubmitEditing={() => {
              lastNameRef.current && lastNameRef.current.focus();
            }}
            returnKeyType="next"
            mode="flat"
            label={t('First Name')}
            value={addressData.firstName}
            onChangeText={(firstName) =>
              setAddressData({ ...addressData, firstName })
            }
            containerStyle={styles.textInput}
          />
          <TextInput
            onSubmitEditing={() => {
              address1Ref.current && address1Ref.current.focus();
            }}
            ref={lastNameRef}
            returnKeyType="next"
            mode="flat"
            label={t('Last Name')}
            value={addressData.lastName}
            onChangeText={(lastName) =>
              setAddressData({ ...addressData, lastName })
            }
            containerStyle={styles.textInput}
          />
          <TextInput
            onSubmitEditing={() => {
              countryRef.current && countryRef.current.focus();
            }}
            returnKeyType="next"
            ref={address1Ref}
            mode="flat"
            label={t('Address')}
            value={addressData.address1}
            onChangeText={(address1) =>
              setAddressData({ ...addressData, address1 })
            }
            containerStyle={styles.textInput}
          />
          <TextInput
            onSubmitEditing={() => {
              provinceRef.current && provinceRef.current.focus();
            }}
            returnKeyType="next"
            ref={countryRef}
            mode="flat"
            label={t('Country')}
            value={addressData.country}
            onChangeText={(country) =>
              setAddressData({ ...addressData, country })
            }
            containerStyle={styles.textInput}
          />
          <TextInput
            onSubmitEditing={() => {
              cityRef.current && cityRef.current.focus();
            }}
            returnKeyType="next"
            ref={provinceRef}
            mode="flat"
            label={t('State / Province')}
            value={addressData.province}
            onChangeText={(province) =>
              setAddressData({ ...addressData, province })
            }
            containerStyle={styles.textInput}
          />
          <TextInput
            onSubmitEditing={() => {
              zipRef.current && zipRef.current.focus();
            }}
            returnKeyType="next"
            ref={cityRef}
            mode="flat"
            label={t('City')}
            value={addressData.city}
            onChangeText={(city) => setAddressData({ ...addressData, city })}
            containerStyle={styles.textInput}
          />
          <TextInput
            onSubmitEditing={() => {
              phoneRef.current && phoneRef.current.focus();
            }}
            returnKeyType="next"
            ref={zipRef}
            mode="flat"
            label={t('Postal / Zip Code')}
            value={addressData.zip}
            onChangeText={(zip) => setAddressData({ ...addressData, zip })}
            containerStyle={styles.textInput}
          />
          <TextInput
            returnKeyType="done"
            ref={phoneRef}
            mode="flat"
            label={t('Phone Number')}
            value={addressData.phone}
            onChangeText={(phone) => setAddressData({ ...addressData, phone })}
            keyboardType="number-pad"
            textContentType="telephoneNumber"
            containerStyle={styles.textInput}
          />
        </ScrollView>
        <Button
          style={[defaultButton, styles.buttonStyle]}
          labelStyle={defaultButtonLabel}
          onPress={onPressSaveAddress}
          loading={loadingAddNewAddress || loadingEditAddress}
        >
          <Text weight="medium" style={styles.buttonText}>
            {t('Save Address')}
          </Text>
        </Button>
      </KeyboardAvoidingView>
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
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  headerRightText: {
    marginRight: 24,
    fontSize: FONT_SIZE.medium,
    color: COLORS.red,
  },
  modal: {
    backgroundColor: COLORS.white,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalTitleContainer: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
  },
  modalTitle: {
    paddingVertical: 16,
    fontSize: FONT_SIZE.large,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    marginVertical: 24,
  },
  modalOptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 38,
  },
  modalCancel: {
    color: COLORS.primaryColor,
    fontSize: FONT_SIZE.medium,
    textTransform: 'uppercase',
  },
  modalDelete: {
    color: COLORS.red,
    fontSize: FONT_SIZE.medium,
    textTransform: 'uppercase',
  },
  textInput: {
    marginTop: 16,
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

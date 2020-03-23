import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput as TextInputType,
  TouchableOpacity,
} from 'react-native';
import { Text, TextInput } from 'exoflex';

import { AddressItem } from '../../../types/types';
import { CountryModal } from '../../../components';
import {
  flatTextInputContainerStyle,
  flatTextInputStyle,
  textInputLabel,
} from '../../../constants/theme';

type Props = {
  address: AddressItem;
  onChangeAddress: (newAddress: AddressItem) => void;
};

export default function ShippingAddressForm(props: Props) {
  let { address, onChangeAddress } = props;
  let [isCountryModalVisible, setCountryModalVisible] = useState<boolean>(
    false,
  );

  let toggleCountryModal = () => {
    setCountryModalVisible(!isCountryModalVisible);
  };

  let onPressCountry = (country: string) => {
    onChangeAddress({ ...address, country });
    toggleCountryModal();
    zipRef.current?.focus();
  };

  let lastNameRef = useRef<TextInputType>(null);
  let address1Ref = useRef<TextInputType>(null);
  let address2Ref = useRef<TextInputType>(null);
  let provinceRef = useRef<TextInputType>(null);
  let cityRef = useRef<TextInputType>(null);
  let zipRef = useRef<TextInputType>(null);
  let phoneRef = useRef<TextInputType>(null);

  return (
    <View style={styles.flex}>
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
        onChangeText={(firstName) => onChangeAddress({ ...address, firstName })}
        returnKeyType="next"
        labelStyle={textInputLabel}
        onSubmitEditing={() => lastNameRef.current?.focus()}
        containerStyle={flatTextInputContainerStyle}
        style={flatTextInputStyle}
      />
      <TextInput
        label={t('Last Name')}
        ref={lastNameRef}
        clearTextOnFocus={false}
        autoCapitalize="words"
        textContentType="name"
        mode="flat"
        value={address.lastName}
        onChangeText={(lastName) => onChangeAddress({ ...address, lastName })}
        returnKeyType="next"
        labelStyle={textInputLabel}
        onSubmitEditing={() => address1Ref.current?.focus()}
        containerStyle={flatTextInputContainerStyle}
        style={flatTextInputStyle}
      />
      <TextInput
        label={t('Address 1')}
        ref={address1Ref}
        clearTextOnFocus={false}
        autoCapitalize="none"
        textContentType="streetAddressLine1"
        mode="flat"
        value={address.address1}
        onChangeText={(address1) => onChangeAddress({ ...address, address1 })}
        returnKeyType="next"
        labelStyle={textInputLabel}
        onSubmitEditing={() => address2Ref.current?.focus()}
        containerStyle={flatTextInputContainerStyle}
        style={flatTextInputStyle}
      />
      <TextInput
        label={t('Address 2 (optional)')}
        ref={address2Ref}
        clearTextOnFocus={false}
        autoCapitalize="none"
        textContentType="streetAddressLine2"
        mode="flat"
        value={address.address2}
        onChangeText={(address2) => onChangeAddress({ ...address, address2 })}
        returnKeyType="next"
        labelStyle={textInputLabel}
        onSubmitEditing={() => cityRef.current?.focus()}
        containerStyle={flatTextInputContainerStyle}
        style={flatTextInputStyle}
      />
      <TextInput
        label={t('City')}
        ref={cityRef}
        clearTextOnFocus={false}
        autoCapitalize="words"
        textContentType="addressCity"
        mode="flat"
        value={address.city}
        onChangeText={(city) => onChangeAddress({ ...address, city })}
        returnKeyType="next"
        labelStyle={textInputLabel}
        onSubmitEditing={() => provinceRef.current?.focus()}
        containerStyle={flatTextInputContainerStyle}
        style={flatTextInputStyle}
      />
      <TextInput
        label={t('Province')}
        ref={provinceRef}
        clearTextOnFocus={false}
        autoCapitalize="words"
        textContentType="addressState"
        mode="flat"
        value={address.province}
        onChangeText={(province) => onChangeAddress({ ...address, province })}
        returnKeyType="next"
        labelStyle={textInputLabel}
        onSubmitEditing={toggleCountryModal}
        containerStyle={flatTextInputContainerStyle}
        style={flatTextInputStyle}
      />
      <TouchableOpacity onPress={toggleCountryModal}>
        <TextInput
          label={t('Country')}
          clearTextOnFocus={false}
          autoCapitalize="words"
          textContentType="countryName"
          mode="flat"
          value={address.country}
          returnKeyType="next"
          labelStyle={textInputLabel}
          pointerEvents="none"
          editable={false}
          containerStyle={flatTextInputContainerStyle}
          style={flatTextInputStyle}
        />
      </TouchableOpacity>
      <TextInput
        label={t('Postal Code')}
        ref={zipRef}
        clearTextOnFocus={false}
        textContentType="postalCode"
        keyboardType="number-pad"
        mode="flat"
        value={address.zip}
        onChangeText={(zip) => onChangeAddress({ ...address, zip })}
        returnKeyType="next"
        labelStyle={textInputLabel}
        onSubmitEditing={() => phoneRef.current?.focus()}
        containerStyle={flatTextInputContainerStyle}
        style={flatTextInputStyle}
      />
      <TextInput
        label={t('Phone Number')}
        ref={phoneRef}
        clearTextOnFocus={false}
        textContentType="telephoneNumber"
        mode="flat"
        value={address.phone}
        onChangeText={(phone) => onChangeAddress({ ...address, phone })}
        returnKeyType="done"
        keyboardType="number-pad"
        labelStyle={textInputLabel}
        containerStyle={flatTextInputContainerStyle}
        style={flatTextInputStyle}
      />
      <CountryModal
        countryVisible={isCountryModalVisible}
        toggleModal={toggleCountryModal}
        onPressCountry={onPressCountry}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  opacity: { opacity: 0.6 },
  shippingInfo: { marginBottom: 16 },
});

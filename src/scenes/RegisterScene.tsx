import React, { useState } from 'react';
import { View, SafeAreaView, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button } from 'exoflex';
import { COLORS } from '../constants/colors';
import { FONT_SIZE } from '../constants/fonts';
import { useDimensions, ScreenSize } from '../helpers/dimensions';
import { validateEmail, validatePassword } from '../helpers/validation';

export default function RegisterScene() {
  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('');
  let [confirmPassword, setConfirmPassword] = useState('');
  let dimensions = useDimensions();
  let onRegisterPressed = () => {
    Alert.alert('Register');
    /*TODO: DO register here */
  };
  let onTermsPressed = () => {
    Alert.alert('Terms & Condition');
    /*TODO: DO switch to terms and condition here */
  };

  let containerStyle = () => {
    let styleApplied;
    if (dimensions.screenSize === ScreenSize.Small) {
      styleApplied = styles.container;
    } else {
      styleApplied = [styles.container, { marginHorizontal: 36 }];
    }
    return styleApplied;
  };
  let isEmailValid = validateEmail(email);
  let isPasswordValid = validatePassword(password);

  let isDisabled =
    !email ||
    !password ||
    !confirmPassword ||
    !isPasswordValid ||
    !isEmailValid;
  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={containerStyle()}>
        <View>
          <View style={styles.textInputContainer}>
            <Text style={styles.greyText}>{t('Email Address')}</Text>
            <TextInput
              autoFocus={true}
              clearTextOnFocus={false}
              autoCapitalize="none"
              errorMessage={
                (isEmailValid && email !== '') || email === ''
                  ? undefined
                  : 'Email is not valid'
              }
              textContentType="emailAddress"
              mode="flat"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.textInputContainer}>
            <Text style={styles.greyText}>{t('Password')}</Text>
            <TextInput
              textContentType="password"
              autoCapitalize="none"
              errorMessage={
                (isPasswordValid && password !== '') || password === ''
                  ? undefined
                  : 'Password must contain number, uppercase and lowercase letter'
              }
              secureTextEntry={true}
              mode="flat"
              value={password}
              onChangeText={setPassword}
            />
          </View>
          <View style={styles.textInputContainer}>
            <Text style={styles.greyText}>{t('Confirm Password')}</Text>
            <TextInput
              clearTextOnFocus={false}
              autoCapitalize="none"
              textContentType="password"
              errorMessage={
                (confirmPassword === password && confirmPassword !== '') ||
                confirmPassword === ''
                  ? undefined
                  : "Password doesn't match"
              }
              secureTextEntry={true}
              mode="flat"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>
        </View>
        <View>
          <Text style={styles.termsAndConditionText}>
            {t('By clicking Register, you agree with our ')}
            <Text style={styles.primaryColorText} onPress={onTermsPressed}>
              {t('Terms & Conditions')}
            </Text>
          </Text>
          <Button
            onPress={onRegisterPressed}
            style={styles.button}
            disabled={isDisabled}
            labelStyle={styles.buttonLabel}
          >
            {t('Register')}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  container: {
    flex: 6,
    marginHorizontal: 24,
    marginTop: 7,
    marginBottom: 24,
    justifyContent: 'space-between',
  },
  textInputContainer: {
    marginVertical: 9,
  },
  button: {
    borderRadius: 2,
    marginTop: 16,
  },
  buttonLabel: {
    color: COLORS.white,
    fontSize: FONT_SIZE.medium,
    textTransform: 'uppercase',
  },
  termsAndConditionText: {
    alignSelf: 'center',
    textAlign: 'center',
  },
  greyText: {
    color: COLORS.grey,
  },
  primaryColorText: {
    color: COLORS.primaryColor,
  },
});

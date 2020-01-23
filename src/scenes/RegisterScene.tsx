import React, { useState, useRef } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Alert,
  TextInput as TextInputType,
} from 'react-native';
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

  let emailRef = useRef<TextInputType>(null);
  let passwordRef = useRef<TextInputType>(null);
  let confirmPasswordRef = useRef<TextInputType>(null);

  let containerStyle = () => {
    let styleApplied;
    if (dimensions.screenSize === ScreenSize.Small) {
      styleApplied = styles.container;
    } else {
      styleApplied = [styles.container, { marginHorizontal: 36 }];
    }
    return styleApplied;
  };
  let [isEmailValid, setIsEmailValid] = useState(true);
  let [isPasswordValid, setIsPasswordValid] = useState(true);
  let [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);

  let isDisabled =
    !email ||
    !password ||
    !confirmPassword ||
    !isPasswordValid ||
    !isEmailValid ||
    !isConfirmPasswordValid;

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
              onFocus={() => {
                setIsEmailValid(true);
              }}
              onBlur={() => {
                setIsEmailValid(validateEmail(email));
              }}
              errorMessage={!isEmailValid ? t('Email is not valid') : undefined}
              textContentType="emailAddress"
              mode="flat"
              value={email}
              errorMessageStyle={styles.errorMessage}
              onChangeText={setEmail}
              containerStyle={styles.insideTextInputContainer}
              returnKeyType="next"
              ref={emailRef}
              onSubmitEditing={() => {
                passwordRef.current && passwordRef.current.focus();
              }}
            />
          </View>
          <View style={styles.textInputContainer}>
            <Text style={styles.greyText}>{t('Password')}</Text>
            <TextInput
              textContentType="password"
              autoCapitalize="none"
              onFocus={() => {
                setIsPasswordValid(true);
              }}
              onBlur={() => {
                setIsPasswordValid(validatePassword(password));
              }}
              errorMessage={
                !isPasswordValid
                  ? t(
                      'Password must contain at least one number, uppercase and lowercase letter',
                    )
                  : undefined
              }
              returnKeyType="next"
              containerStyle={styles.insideTextInputContainer}
              secureTextEntry={true}
              mode="flat"
              value={password}
              errorMessageStyle={styles.errorMessage}
              onChangeText={setPassword}
              ref={passwordRef}
              onSubmitEditing={() => {
                confirmPasswordRef.current &&
                  confirmPasswordRef.current.focus();
              }}
            />
          </View>
          <View style={styles.textInputContainer}>
            <Text style={styles.greyText}>{t('Confirm Password')}</Text>
            <TextInput
              clearTextOnFocus={false}
              autoCapitalize="none"
              onFocus={() => {
                setIsConfirmPasswordValid(true);
              }}
              onBlur={() => {
                setIsConfirmPasswordValid(confirmPassword === password);
              }}
              errorMessage={
                !isConfirmPasswordValid
                  ? t('Password does not match')
                  : undefined
              }
              containerStyle={styles.insideTextInputContainer}
              secureTextEntry={true}
              mode="flat"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              errorMessageStyle={styles.errorMessage}
              ref={confirmPasswordRef}
              returnKeyType="done"
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
    height: 60,
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
  insideTextInputContainer: {
    margin: 0,
    paddingVertical: 10,
  },
  errorMessage: {
    padding: 0,
    marginTop: 0,
  },
});

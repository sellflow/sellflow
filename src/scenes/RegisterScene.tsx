import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TextInput as TextInputType,
  AsyncStorage,
} from 'react-native';
import { Text, TextInput, Button } from 'exoflex';

import { COLORS } from '../constants/colors';
import { useDimensions, ScreenSize } from '../helpers/dimensions';
import {
  INVALID_EMAIL_MESSAGE,
  INVALID_PASSWORD_MESSAGE,
  validateEmail,
  validatePassword,
} from '../helpers/validation';
import { defaultButtonLabel, defaultButton } from '../constants/theme';
import { useMutation } from '@apollo/react-hooks';
import { CUSTOMER_REGISTER } from '../graphql/server/auth';
import { SET_AUTHENTICATED_USER } from '../graphql/client/clientQueries';
import { useNavigation } from '@react-navigation/native';
import { StackNavProp } from '../types/Navigation';
import {
  CustomerRegister,
  CustomerRegisterVariables,
} from '../generated/server/CustomerRegister';
import {
  SetAuthenticatedUser,
  SetAuthenticatedUserVariables,
} from '../generated/client/SetAuthenticatedUser';

export default function RegisterScene() {
  let navigation = useNavigation<StackNavProp<'Register'>>();
  let [firstName, setFirstName] = useState('');
  let [lastName, setLastName] = useState('');
  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('');
  let [confirmPassword, setConfirmPassword] = useState('');
  let dimensions = useDimensions();
  let onSubmit = () => {
    register();
  };
  let onTermsPressed = () => {
    Alert.alert('Terms & Condition');
    // TODO: Show terms and condition here
  };

  let firstNameRef = useRef<TextInputType>(null);
  let lastNameRef = useRef<TextInputType>(null);
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
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !confirmPassword ||
    !isPasswordValid ||
    !isEmailValid ||
    !isConfirmPasswordValid ||
    password !== confirmPassword;

  let [register, { loading: registerLoading }] = useMutation<
    CustomerRegister,
    CustomerRegisterVariables
  >(CUSTOMER_REGISTER, {
    variables: {
      email,
      password,
      firstName,
      lastName,
    },
    onError: (error) => {
      Alert.alert('Error ocurred!', error.message);
    },
    onCompleted: ({ customerCreate, customerAccessTokenCreate }) => {
      if (
        customerCreate &&
        customerCreate.customer &&
        customerAccessTokenCreate &&
        customerAccessTokenCreate.customerAccessToken
      ) {
        let { email, id, firstName, lastName } = customerCreate.customer;
        let {
          accessToken,
          expiresAt,
        } = customerAccessTokenCreate.customerAccessToken;
        AsyncStorage.setItem('accessToken', accessToken);
        if (email && firstName && lastName) {
          setAuthenticatedUser({
            variables: {
              user: {
                id,
                email,
                expiresAt,
                firstName,
                lastName,
              },
            },
          });
        }
      }
    },
  });

  let [setAuthenticatedUser, { loading: localStateLoading }] = useMutation<
    SetAuthenticatedUser,
    SetAuthenticatedUserVariables
  >(SET_AUTHENTICATED_USER, {
    onCompleted: () => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Profile' }],
      });
    },
  });

  let isLoading = localStateLoading || registerLoading;
  return (
    <View style={containerStyle()}>
      <View>
        <View style={styles.textInputContainer}>
          <Text style={styles.greyText}>{t('First Name')}</Text>
          <TextInput
            autoFocus={false}
            clearTextOnFocus={false}
            autoCapitalize="none"
            textContentType="name"
            mode="flat"
            value={firstName}
            onChangeText={setFirstName}
            containerStyle={styles.insideTextInputContainer}
            returnKeyType="next"
            ref={firstNameRef}
            onSubmitEditing={() => {
              lastNameRef.current && lastNameRef.current.focus();
            }}
          />
        </View>
        <View style={styles.textInputContainer}>
          <Text style={styles.greyText}>{t('Last Name')}</Text>
          <TextInput
            autoFocus={false}
            clearTextOnFocus={false}
            autoCapitalize="none"
            textContentType="name"
            mode="flat"
            value={lastName}
            onChangeText={setLastName}
            containerStyle={styles.insideTextInputContainer}
            returnKeyType="next"
            ref={lastNameRef}
            onSubmitEditing={() => {
              emailRef.current && emailRef.current.focus();
            }}
          />
        </View>
        <View style={styles.textInputContainer}>
          <Text style={styles.greyText}>{t('Email Address')}</Text>
          <TextInput
            autoFocus={false}
            clearTextOnFocus={false}
            autoCapitalize="none"
            onFocus={() => {
              setIsEmailValid(true);
            }}
            onBlur={() => {
              setIsEmailValid(validateEmail(email));
            }}
            errorMessage={!isEmailValid ? INVALID_EMAIL_MESSAGE : undefined}
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
              !isPasswordValid ? INVALID_PASSWORD_MESSAGE : undefined
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
              confirmPasswordRef.current && confirmPasswordRef.current.focus();
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
              !isConfirmPasswordValid ? t('Password does not match') : undefined
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
          loading={isLoading}
          onPress={onSubmit}
          style={[defaultButton, styles.button]}
          disabled={isDisabled}
          labelStyle={defaultButtonLabel}
        >
          {t('Register')}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 24,
    marginHorizontal: 24,
    marginTop: 7,
    justifyContent: 'space-between',
  },
  textInputContainer: {
    marginVertical: 9,
    height: 60,
  },
  button: {
    marginTop: 16,
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

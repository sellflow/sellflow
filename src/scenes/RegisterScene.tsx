import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TextInput as TextInputType,
  TouchableOpacity,
} from 'react-native';
import { Text, TextInput, Button, Portal } from 'exoflex';

import { COLORS } from '../constants/colors';
import { useDimensions, ScreenSize } from '../helpers/dimensions';
import {
  INVALID_EMAIL_MESSAGE,
  INVALID_PASSWORD_MESSAGE,
  validateEmail,
  validatePassword,
} from '../helpers/validation';
import { defaultButtonLabel, defaultButton } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { StackNavProp } from '../types/Navigation';
import { useSetAuthenticatedUser } from '../hooks/api/useAuthenticatedUser';
import { useCustomerRegister } from '../hooks/api/useCustomer';
import { useAuth } from '../helpers/useAuth';
import { ModalBottomSheet } from '../core-ui';
import { ModalBottomSheetMessage } from '../components';
import { useGetShop } from '../hooks/api/useCustomerAddress';

export default function RegisterScene() {
  let navigation = useNavigation<StackNavProp<'Register'>>();
  let { setAuthToken } = useAuth();
  let [firstName, setFirstName] = useState<string>('');
  let [lastName, setLastName] = useState<string>('');
  let [email, setEmail] = useState<string>('');
  let [password, setPassword] = useState<string>('');
  let [confirmPassword, setConfirmPassword] = useState<string>('');
  let [isVisible, setIsVisible] = useState<boolean>(false);
  let [errorMessage, setErrorMessage] = useState<string>('');
  let toggleModalVisible = () => setIsVisible(!isVisible);
  let { data } = useGetShop();

  let dimensions = useDimensions();
  let onSubmit = () => {
    register({
      variables: {
        email,
        password,
        firstName,
        lastName,
      },
    });
  };
  let onTermsPressed = () => {
    navigation.navigate('WebView', {
      webUrl: data?.shop.termsOfService?.url,
      type: 'terms',
    });
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
  let [isEmailValid, setIsEmailValid] = useState<boolean>(true);
  let [isPasswordValid, setIsPasswordValid] = useState<boolean>(true);
  let [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState<boolean>(
    true,
  );

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

  let { register, loading: registerLoading } = useCustomerRegister({
    onError: (error) => {
      let { message } = error;
      let errorMessage = message.split('GraphQL error: ')[1];
      setErrorMessage(errorMessage);
      toggleModalVisible();
    },
    onCompleted: ({ customerCreate, customerAccessTokenCreate }) => {
      if (customerCreate && customerCreate.customerUserErrors.length > 0) {
        setErrorMessage(customerCreate.customerUserErrors[0].message);
        toggleModalVisible();
        return;
      }
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
        setAuthToken(accessToken);
        if (email && firstName && lastName) {
          setUser({
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

  let {
    setUser,
    loading: setAuthenticatedUserLoading,
  } = useSetAuthenticatedUser({
    onCompleted: () => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Profile' }],
      });
    },
  });

  let isLoading = setAuthenticatedUserLoading || registerLoading;
  return (
    <View style={containerStyle()}>
      <Portal>
        <ModalBottomSheet
          title={t('Something went wrong!')}
          isModalVisible={isVisible}
          toggleModal={toggleModalVisible}
        >
          <ModalBottomSheetMessage
            isError={true}
            message={errorMessage}
            onPressModalButton={toggleModalVisible}
            buttonText={t('Close')}
          />
        </ModalBottomSheet>
      </Portal>
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
          {t('By clicking Register, you agree with our')}
        </Text>
        <TouchableOpacity onPress={onTermsPressed} activeOpacity={1}>
          <Text style={styles.primaryColorText}>{t('Terms & Conditions')}</Text>
        </TouchableOpacity>
        <Button
          loading={isLoading}
          onPress={onSubmit}
          style={[defaultButton, styles.button]}
          disabled={isDisabled}
          labelStyle={defaultButtonLabel}
        >
          {!isLoading && t('Register')}
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
    marginTop: 4,
    alignSelf: 'center',
    textAlign: 'center',
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

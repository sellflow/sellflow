import React, { useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput as TextInputType,
  TouchableOpacity,
  View,
} from 'react-native';
import { Portal } from 'react-native-paper';

import { useNavigation } from '@react-navigation/native';

import { ModalBottomSheetMessage } from '../components';
import { COLORS } from '../constants/colors';
import {
  defaultButton,
  defaultButtonLabel,
  flatTextInputContainerStyle,
  flatTextInputStyle,
  textInputLabel,
} from '../constants/theme';
import {
  Button,
  KeyboardAvoidingView,
  ModalBottomSheet,
  Text,
  TextInput,
} from '../core-ui';
import { ScreenSize, useDimensions } from '../helpers/dimensions';
import { useAuth } from '../helpers/useAuth';
import {
  INVALID_EMAIL_MESSAGE,
  INVALID_PASSWORD_MESSAGE,
  validateEmail,
  validatePassword,
} from '../helpers/validation';
import { useSetAuthenticatedUser } from '../hooks/api/useAuthenticatedUser';
import { useCustomerRegister } from '../hooks/api/useCustomer';
import { useGetShop } from '../hooks/api/useCustomerAddress';
import { StackNavProp } from '../types/Navigation';

export default function RegisterScene() {
  let { navigate, reset } = useNavigation<StackNavProp<'Register'>>();
  let { setAuthToken } = useAuth();
  let [firstName, setFirstName] = useState('');
  let [lastName, setLastName] = useState('');
  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('');
  let [confirmPassword, setConfirmPassword] = useState('');
  let [isVisible, setIsVisible] = useState(false);
  let [errorMessage, setErrorMessage] = useState('');
  let toggleModalVisible = () => setIsVisible(!isVisible);
  let { data } = useGetShop();

  let { screenSize } = useDimensions();
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
    navigate('WebView', {
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
    if (screenSize === ScreenSize.Small) {
      styleApplied = styles.container;
    } else {
      styleApplied = [styles.container, { marginHorizontal: 36 }];
    }
    return styleApplied;
  };
  let [isEmailValid, setIsEmailValid] = useState(true);
  let [isPasswordValid, setIsPasswordValid] = useState(true);
  let [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);
  let [bottomButtonHeight, setBottomButtonHeight] = useState(0);

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
      reset({
        index: 0,
        routes: [
          {
            name: 'Home',
            state: {
              routes: [{ name: 'ProfileTab' }],
            },
          },
        ],
      });
    },
  });

  let isLoading = setAuthenticatedUserLoading || registerLoading;
  return (
    <SafeAreaView style={containerStyle()}>
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
      <KeyboardAvoidingView keyboardVerticalOffset={bottomButtonHeight}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TextInput
            autoFocus={false}
            clearTextOnFocus={false}
            autoCapitalize="none"
            textContentType="name"
            mode="flat"
            value={firstName}
            onChangeText={setFirstName}
            label={t('First Name')}
            labelStyle={textInputLabel}
            returnKeyType="next"
            ref={firstNameRef}
            onSubmitEditing={() => {
              lastNameRef.current && lastNameRef.current.focus();
            }}
            containerStyle={flatTextInputContainerStyle}
            style={flatTextInputStyle}
          />
          <TextInput
            autoFocus={false}
            clearTextOnFocus={false}
            autoCapitalize="none"
            textContentType="name"
            mode="flat"
            value={lastName}
            label={t('Last Name')}
            labelStyle={textInputLabel}
            onChangeText={setLastName}
            returnKeyType="next"
            ref={lastNameRef}
            onSubmitEditing={() => {
              emailRef.current && emailRef.current.focus();
            }}
            containerStyle={flatTextInputContainerStyle}
            style={flatTextInputStyle}
          />
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
            label={t('Email Address')}
            labelStyle={textInputLabel}
            value={email}
            errorMessageStyle={styles.errorMessage}
            onChangeText={setEmail}
            returnKeyType="next"
            ref={emailRef}
            onSubmitEditing={() => {
              passwordRef.current && passwordRef.current.focus();
            }}
            containerStyle={flatTextInputContainerStyle}
            style={flatTextInputStyle}
          />
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
            secureTextEntry={true}
            mode="flat"
            label={t('Password')}
            labelStyle={textInputLabel}
            value={password}
            errorMessageStyle={styles.errorMessage}
            onChangeText={setPassword}
            ref={passwordRef}
            onSubmitEditing={() => {
              confirmPasswordRef.current && confirmPasswordRef.current.focus();
            }}
            containerStyle={flatTextInputContainerStyle}
            style={flatTextInputStyle}
          />
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
            secureTextEntry={true}
            mode="flat"
            label={t('Confirm Password')}
            labelStyle={textInputLabel}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            errorMessageStyle={styles.errorMessage}
            ref={confirmPasswordRef}
            returnKeyType="done"
            containerStyle={flatTextInputContainerStyle}
            style={flatTextInputStyle}
          />
        </ScrollView>
      </KeyboardAvoidingView>
      <View
        onLayout={({ nativeEvent }) => {
          setBottomButtonHeight(nativeEvent.layout.height);
        }}
      >
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 24,
    marginTop: 7,
    justifyContent: 'space-between',
  },
  button: {
    marginTop: 16,
    marginBottom: 24,
  },
  termsAndConditionText: {
    alignSelf: 'center',
    textAlign: 'center',
  },
  primaryColorText: {
    color: COLORS.primaryColor,
    marginTop: 4,
    alignSelf: 'center',
    textAlign: 'center',
  },
  errorMessage: {
    padding: 0,
    marginTop: 0,
  },
});

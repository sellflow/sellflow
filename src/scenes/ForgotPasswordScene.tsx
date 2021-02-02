import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { TextInput, Button } from 'exoflex';
import { useNavigation } from '@react-navigation/native';

import {
  defaultButton,
  defaultButtonLabel,
  flatTextInputContainerStyle,
  flatTextInputStyle,
} from '../constants/theme';
import { StackNavProp } from '../types/Navigation';
import { useForgotPasswordMutation } from '../hooks/api/useAuthenticatedUser';
import { ModalBottomSheet } from '../core-ui';
import { ModalBottomSheetMessage } from '../components';

export default function ForgotPasswordScene() {
  let { navigate } = useNavigation<StackNavProp<'ForgotPassword'>>();

  let [emailValue, setEmailValue] = useState<string>('');
  let [isVisible, setVisible] = useState<boolean>(false);
  let [error, setError] = useState<string>('');

  const isError = error !== '';

  let toggleModalVisible = () => setVisible(!isVisible);

  let { resetPassword, loading } = useForgotPasswordMutation({
    onCompleted({ customerRecover }) {
      if (emailValue === '') {
        setError(errorMessage);
        toggleModalVisible();
      } else {
        if (customerRecover && customerRecover.customerUserErrors.length > 0) {
          setError(customerRecover.customerUserErrors[0].message);
          toggleModalVisible();
        }
        toggleModalVisible();
      }
    },
    onError(error) {
      let { message } = error;
      let errorMessage = message.split('GraphQL error: ')[1];
      setError(errorMessage);
      toggleModalVisible();
    },
  });

  let onPressButton = () => {
    resetPassword({
      variables: {
        email: emailValue,
      },
    });
  };

  let onPressModalButton = () => {
    setVisible(!isVisible);
    setEmailValue('');
    navigate('Auth', { initialRouteKey: 'Login' });
  };

  let errorMessage = isError
    ? t('{error}', { error })
    : t(
        'An email has been sent to reset your password. Please check your email.',
      );

  return (
    <SafeAreaView style={styles.flex}>
      <ModalBottomSheet
        title={isError ? t('An Error Occured!') : t('Email Has Been Sent!')}
        isModalVisible={isVisible}
        toggleModal={toggleModalVisible}
      >
        <ModalBottomSheetMessage
          isError={isError}
          message={errorMessage}
          onPressModalButton={onPressModalButton}
          buttonText={isError ? t('Try Again') : t('Back To Login')}
        />
      </ModalBottomSheet>
      <View style={styles.textInputContainer}>
        <TextInput
          mode="flat"
          label={t('Email Address')}
          value={emailValue}
          onChangeText={setEmailValue}
          autoFocus={true}
          autoCapitalize="none"
          containerStyle={flatTextInputContainerStyle}
          style={flatTextInputStyle}
        />
      </View>
      <Button
        style={[defaultButton, styles.buttonStyle]}
        labelStyle={defaultButtonLabel}
        onPress={onPressButton}
        loading={loading}
      >
        {!loading && t('Reset Password')}
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  textInputContainer: {
    flex: 1,
    marginTop: 16,
    marginHorizontal: 24,
  },
  buttonStyle: {
    marginVertical: 24,
    marginHorizontal: 24,
  },
});

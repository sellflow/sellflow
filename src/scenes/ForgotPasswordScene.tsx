import React, { useState } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import {
  TextInput,
  Button,
  ActivityIndicator,
  Portal,
  Modal,
  Text,
} from 'exoflex';
import { useNavigation } from '@react-navigation/native';

import { defaultButton, defaultButtonLabel } from '../constants/theme';
import { COLORS } from '../constants/colors';
import { FONT_SIZE } from '../constants/fonts';
import { StackNavProp } from '../types/Navigation';
import { useForgotPasswordMutation } from '../hooks/api/useAuthenticatedUser';

export default function ForgotPasswordScene() {
  let { navigate } = useNavigation<StackNavProp<'ForgotPassword'>>();

  let [emailValue, setEmailValue] = useState<string>('');
  let [isVisible, setVisible] = useState<boolean>(false);
  let [error, setError] = useState<string>('');

  const isError = error !== '';

  let { resetPassword, loading } = useForgotPasswordMutation({
    onCompleted({ customerRecover }) {
      if (emailValue === '') {
        Alert.alert(t('Please Enter Your Email'));
      } else {
        if (customerRecover && customerRecover.customerUserErrors.length > 0) {
          setError(customerRecover.customerUserErrors[0].message);
          setVisible(!isVisible);
        }
        setVisible(!isVisible);
      }
    },
    onError(error) {
      setError(error.message);
      setVisible(!isVisible);
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
    navigate('Login');
  };

  if (loading) {
    <View style={styles.center}>
      <ActivityIndicator size="large" />
    </View>;
  }

  return (
    <View style={styles.flex}>
      <Portal>
        <Modal
          contentContainerStyle={styles.modal}
          visible={isVisible}
          onDismiss={() => setVisible(!isVisible)}
        >
          <View style={styles.modalTitleContainer}>
            <Text weight="medium" style={styles.modalTitle}>
              {isError ? t('An Error Occurred') : t('Email Has Been Sent!')}
            </Text>
          </View>
          <View style={styles.iconContainer}>
            {isError ? (
              <Image
                source={require('../../assets/images/errorImage.png')}
                style={styles.image}
              />
            ) : (
              <Image
                source={require('../../assets/images/successImage.png')}
                style={styles.image}
              />
            )}
          </View>
          <Text style={styles.message}>
            {isError
              ? t(
                  'Sorry, an error occurred on this process. Please try again later.',
                )
              : t(
                  'Please check your email, An email has been sent to reset your password.',
                )}
          </Text>
          <Button style={styles.buttonStyle} onPress={onPressModalButton}>
            <Text weight="medium" style={styles.buttonText}>
              {isError ? t('Try Again') : t('Back To Login')}
            </Text>
          </Button>
        </Modal>
      </Portal>
      <View style={styles.textInputContainer}>
        <TextInput
          mode="flat"
          style={styles.textInput}
          containerStyle={styles.textInput}
          label={t('Email Address')}
          value={emailValue}
          onChangeText={setEmailValue}
          autoFocus={true}
          autoCapitalize="none"
        />
      </View>
      <Button
        style={[defaultButton, styles.buttonStyle]}
        labelStyle={defaultButtonLabel}
        onPress={onPressButton}
      >
        {t('Reset Password')}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 84,
    height: 84,
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
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  textInputContainer: {
    flex: 1,
    marginHorizontal: 24,
  },
  textInput: {
    marginTop: 8,
  },
  message: {
    textAlign: 'center',
  },
  buttonStyle: {
    marginVertical: 24,
    marginHorizontal: 24,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.medium,
    textTransform: 'uppercase',
  },
});

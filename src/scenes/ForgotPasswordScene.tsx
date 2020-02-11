import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import {
  TextInput,
  Button,
  ActivityIndicator,
  Portal,
  Modal,
  Text,
  IconButton,
} from 'exoflex';
import { useNavigation } from '@react-navigation/native';

import { defaultButton, defaultButtonLabel } from '../constants/theme';
import { COLORS } from '../constants/colors';
import { FONT_SIZE } from '../constants/fonts';
import { StackNavProp } from '../types/Navigation';
import { useForgotPasswordMutation } from '../hooks/api/useAuthenticatedUser';

export default function ForgotPasswordScene() {
  let { navigate } = useNavigation<StackNavProp<'ForgotPassword'>>();
  let [emailValue, setEmailValue] = useState('');
  let [isVisible, setVisible] = useState(false);

  let { resetPassword, loading } = useForgotPasswordMutation({
    onCompleted() {
      if (emailValue === '') {
        Alert.alert(t('Please enter your email'));
      } else {
        setVisible(!isVisible);
      }
    },
    onError(error) {
      let newError = error.message.split(':');
      Alert.alert(newError[1] || error.message);
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
              {t('Email has been sent!')}
            </Text>
          </View>
          <View style={styles.iconContainer}>
            <IconButton
              icon="check"
              style={styles.icon}
              color={COLORS.orderStatusDelivered}
              size={50}
            />
          </View>
          <Button style={styles.buttonStyle} onPress={onPressModalButton}>
            <Text weight="medium" style={styles.buttonText}>
              {t('Back lo Login')}
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
  icon: {
    backgroundColor: COLORS.lightGreen,
  },
  textInputContainer: {
    flex: 1,
    marginHorizontal: 24,
  },
  textInput: {
    marginTop: 8,
  },
  buttonStyle: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.medium,
    textTransform: 'uppercase',
  },
});

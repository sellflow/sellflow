import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'exoflex';

import { defaultButton, defaultButtonLabel } from '../constants/theme';

export default function ForgotPasswordScene() {
  let [emailValue, setEmailValue] = useState('');

  let onPressButton = () => {
    // TODO
  };

  return (
    <View style={styles.flex}>
      <View style={styles.textInputContainer}>
        <TextInput
          mode="flat"
          style={styles.textInput}
          containerStyle={styles.textInput}
          label={t('Email Address')}
          value={emailValue}
          onChangeText={setEmailValue}
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
});

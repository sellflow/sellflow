import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'exoflex';

import { FONT_SIZE } from '../constants/fonts';
import { COLORS } from '../constants/colors';

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
      <Button style={styles.buttonStyle} onPress={onPressButton}>
        <Text weight="medium" style={styles.textButton}>
          {t('Reset Password')}
        </Text>
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
    height: 48,
    marginHorizontal: 24,
    marginBottom: 24,
  },
  textButton: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.white,
    textTransform: 'uppercase',
  },
});

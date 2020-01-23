import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput as TextInputType,
} from 'react-native';
import { Text, TextInput, Button } from 'exoflex';
import { useNavigation } from '@react-navigation/native';

import { FONT_SIZE } from '../constants/fonts';
import { COLORS } from '../constants/colors';
import { useDimensions, ScreenSize } from '../helpers/dimensions';
import { defaultButtonLabel, defaultButton } from '../constants/theme';
import { StackNavProp } from '../types/Navigation';

export default function ProfileScene() {
  let { navigate } = useNavigation<StackNavProp<'Login'>>();
  let [email, setEmail] = useState();
  let [password, setPassword] = useState();

  let emailRef = useRef<TextInputType>(null);
  let passwordRef = useRef<TextInputType>(null);

  let dimensions = useDimensions();

  let containerStyle = () => {
    let styleApplied;

    switch (dimensions.screenSize) {
      case ScreenSize.Small: {
        styleApplied = styles.normal;
        break;
      }
      case ScreenSize.Medium: {
        styleApplied = styles.tabPortrait;
        break;
      }
      case ScreenSize.Large: {
        styleApplied = styles.landscape;
        break;
      }
    }
    return styleApplied;
  };

  return (
    <View style={[containerStyle(), styles.container]}>
      <View>
        <TextInput
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          containerStyle={styles.textInputContainer}
          labelStyle={styles.inputLabel}
          style={styles.textSize}
          returnKeyType="next"
          ref={emailRef}
          onSubmitEditing={() => {
            passwordRef.current && passwordRef.current.focus();
          }}
        />
        <TextInput
          returnKeyType="done"
          ref={passwordRef}
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          containerStyle={styles.textInputContainer}
          labelStyle={styles.inputLabel}
          style={styles.textSize}
        />
        <TouchableOpacity
          style={styles.forgetPassword}
          onPress={() => navigate('ForgotPassword')}
        >
          <Text style={[styles.colorPrimary, styles.textSize]} weight="medium">
            {t('Forgot Password?')}
          </Text>
        </TouchableOpacity>
      </View>
      <Button style={defaultButton} labelStyle={defaultButtonLabel}>
        {t('Log in')}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  textInputContainer: {
    borderWidth: 0,
    borderBottomWidth: 1,
    justifyContent: 'center',
    marginTop: 16,
  },
  forgetPassword: { alignSelf: 'flex-end', marginTop: 24 },
  inputLabel: { fontSize: FONT_SIZE.small, marginBottom: 12 },
  textSize: { fontSize: FONT_SIZE.medium },
  colorPrimary: { color: COLORS.primaryColor },
  normal: {
    paddingHorizontal: 24,
  },
  tabPortrait: {
    paddingHorizontal: 36,
  },
  landscape: {
    paddingHorizontal: 36,
  },
});

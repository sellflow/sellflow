import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput as TextInputType,
  Alert,
  AsyncStorage,
} from 'react-native';
import { Text, TextInput, Button } from 'exoflex';
import { useNavigation } from '@react-navigation/native';

import { FONT_SIZE } from '../constants/fonts';
import { COLORS } from '../constants/colors';
import { useDimensions, ScreenSize } from '../helpers/dimensions';
import { defaultButtonLabel, defaultButton } from '../constants/theme';
import { StackNavProp } from '../types/Navigation';
import { useSetAuthenticatedUser } from '../helpers/queriesAndMutations/useAuthenticatedUser';
import {
  useCustomerCreateToken,
  useGetCustomerData,
} from '../helpers/queriesAndMutations/useCustomer';

export default function ProfileScene() {
  let navigation = useNavigation<StackNavProp<'Login'>>();
  let [email, setEmail] = useState();
  let [password, setPassword] = useState();

  let emailRef = useRef<TextInputType>(null);
  let passwordRef = useRef<TextInputType>(null);

  let dimensions = useDimensions();
  let [expiresDate, setExpiresDate] = useState('');

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

  let {
    setUser,
    loading: setAuthenticatedUserLoading,
  } = useSetAuthenticatedUser({
    onCompleted: () => {
      // Note: I'm not sure if this is correct.
      navigation.reset({
        index: 0,
        routes: [{ name: 'Profile' }],
      });
    },
  });

  let { createToken, createTokenLoading } = useCustomerCreateToken({
    variables: { email, password },
    onCompleted: ({ customerAccessTokenCreate }) => {
      if (
        customerAccessTokenCreate &&
        customerAccessTokenCreate.customerAccessToken
      ) {
        let {
          accessToken,
          expiresAt,
        } = customerAccessTokenCreate.customerAccessToken;
        setExpiresDate(expiresAt);
        AsyncStorage.setItem('accessToken', accessToken);
        login({ variables: { accessToken } });
      } else {
        Alert.alert(
          'Something went wrong!',
          'Your email or password might be wrong!',
        );
      }
    },
  });

  let { getCustomer: login, getCustomerLoading } = useGetCustomerData({
    onCompleted: ({ customer }) => {
      if (customer) {
        let { email, id, firstName, lastName } = customer;
        if (email && firstName && lastName) {
          setUser({
            variables: {
              user: {
                email,
                id,
                expiresAt: expiresDate,
                firstName,
                lastName,
              },
            },
          });
        }
      }
    },
  });

  let onSubmit = () => {
    createToken();
  };

  let onPressForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  let isLoading =
    createTokenLoading || getCustomerLoading || setAuthenticatedUserLoading;

  return (
    <View style={[containerStyle(), styles.container]}>
      <View>
        <TextInput
          label={t('Email Address')}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
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
          label={t('Password')}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          secureTextEntry={true}
          containerStyle={styles.textInputContainer}
          labelStyle={styles.inputLabel}
          style={styles.textSize}
        />
        <TouchableOpacity
          style={styles.forgetPassword}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text
            onPress={onPressForgotPassword}
            style={[styles.colorPrimary, styles.textSize]}
            weight="medium"
          >
            {t('Forgot Password?')}
          </Text>
        </TouchableOpacity>
      </View>
      <Button
        loading={isLoading}
        style={defaultButton}
        labelStyle={defaultButtonLabel}
        onPress={onSubmit}
      >
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

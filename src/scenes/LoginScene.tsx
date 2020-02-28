import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput as TextInputType,
  Alert,
} from 'react-native';
import { Text, TextInput, Button } from 'exoflex';
import { useNavigation } from '@react-navigation/native';

import { FONT_SIZE } from '../constants/fonts';
import { COLORS } from '../constants/colors';
import { useDimensions, ScreenSize } from '../helpers/dimensions';
import { defaultButtonLabel, defaultButton } from '../constants/theme';
import { StackNavProp } from '../types/Navigation';
import { useSetAuthenticatedUser } from '../hooks/api/useAuthenticatedUser';
import {
  useCustomerCreateToken,
  useGetCustomerData,
} from '../hooks/api/useCustomer';
import { useAuth } from '../helpers/useAuth';
import { useSetShoppingCart } from '../hooks/api/useShoppingCart';

export default function LoginScene() {
  let { navigate, reset } = useNavigation<StackNavProp<'Login'>>();
  let { setAuthToken } = useAuth();
  let [email, setEmail] = useState<string>('');
  let [password, setPassword] = useState<string>('');

  let emailRef = useRef<TextInputType>(null);
  let passwordRef = useRef<TextInputType>(null);

  let dimensions = useDimensions();
  let [expiresDate, setExpiresDate] = useState<string>('');

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
    setShoppingCart,
    loading: setShoppingCartLoading,
  } = useSetShoppingCart();

  let {
    setUser,
    loading: setAuthenticatedUserLoading,
  } = useSetAuthenticatedUser({
    onCompleted: () => {
      reset({
        index: 0,
        routes: [{ name: 'Profile' }],
      });
    },
  });

  let { createToken, loading: createTokenLoading } = useCustomerCreateToken({
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
        setAuthToken(accessToken);
        login({ variables: { accessToken } });
      } else {
        Alert.alert(
          'Something went wrong!',
          'Your email or password might be wrong!',
        );
      }
    },
  });

  let { getCustomer: login, loading: getCustomerLoading } = useGetCustomerData({
    onCompleted: async ({ customer }) => {
      if (customer) {
        let {
          email,
          id,
          firstName,
          lastName,
          lastIncompleteCheckout,
        } = customer;
        let items: Array<{ quantity: number; variantId: string }> = [];
        if (lastIncompleteCheckout) {
          let { id: cartID } = lastIncompleteCheckout;
          items = lastIncompleteCheckout.lineItems.edges.map(({ node }): {
            quantity: number;
            variantId: string;
          } => {
            let { quantity, variant } = node;
            let variantId = '';
            if (variant) {
              variantId = variant.id;
            }
            return { quantity, variantId };
          });
          await setShoppingCart({ variables: { items, id: cartID } });
        }
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

  let isLoading =
    createTokenLoading ||
    getCustomerLoading ||
    setAuthenticatedUserLoading ||
    setShoppingCartLoading;

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
          onPress={() => navigate('ForgotPassword')}
        >
          <Text style={[styles.colorPrimary, styles.textSize]} weight="medium">
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

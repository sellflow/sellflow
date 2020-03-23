import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, ActivityIndicator } from 'exoflex';
import { useNavigation } from '@react-navigation/native';

import { FONT_SIZE, FONT_FAMILY } from '../constants/fonts';
import { COLORS } from '../constants/colors';
import { StackNavProp, TabNavProp } from '../types/Navigation';
import { useGetAuthenticatedUser } from '../hooks/api/useAuthenticatedUser';
import { useAuth } from '../helpers/useAuth';
import { Avatar } from '../core-ui';
import { useDeactivateCustomerToken } from '../hooks/api/useCustomer';
import { useResetCart } from '../hooks/api/useShoppingCart';
import { useGetShop } from '../hooks/api/useCustomerAddress';

export default function ProfileScene() {
  let { navigate } = useNavigation<
    StackNavProp<'Profile'> & TabNavProp<'ProfileTab'>
  >();
  let { authToken, setAuthToken } = useAuth();
  let { data } = useGetShop();

  let { resetShoppingCart } = useResetCart();

  let {
    data: authenticatedUser,
    loading: getAuthenticatedUserLoading,
  } = useGetAuthenticatedUser();

  let { deactivateCustomerToken } = useDeactivateCustomerToken({
    variables: { customerAccessToken: authToken },
    onCompleted: () => onLogout(),
  });

  if (getAuthenticatedUserLoading || !authenticatedUser) {
    return <ActivityIndicator style={styles.centered} />;
  }

  let onLogout = () => {
    setAuthToken('');
    navigate('HomeTab');
  };

  let { email, firstName, lastName } = authenticatedUser.authenticatedUser;

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.profileContainer}
        onPress={() =>
          navigate('EditProfile', { customerAccessToken: authToken })
        }
      >
        <Avatar firstName={firstName} lastName={lastName} size={84} />
        <View style={styles.profile}>
          <Text style={styles.nameTextStyle}>
            {firstName} {lastName}
          </Text>
          <Text style={styles.emailTextStyle}>{email}</Text>
        </View>
      </TouchableOpacity>
      <View style={[styles.menuContainer, styles.divider]}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            navigate('EditProfile', { customerAccessToken: authToken })
          }
        >
          <Text style={styles.buttonLabelStyle}>{t('Edit Profile')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            navigate('AddressManagement', { customerAccessToken: authToken })
          }
        >
          <Text style={styles.buttonLabelStyle}>{t('Manage Addresses')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            navigate('OrderHistory', { customerAccessToken: authToken })
          }
        >
          <Text style={styles.buttonLabelStyle}>{t('Order History')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
          <Text style={styles.buttonLabelStyle}>{t('About Us')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            navigate('WebView', {
              webUrl: data?.shop.termsOfService?.url,
              type: 'terms',
            });
          }}
        >
          <Text style={styles.buttonLabelStyle}>{t('Terms & Conditions')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            navigate('WebView', {
              webUrl: data?.shop.privacyPolicy?.url,
              type: 'policy',
            });
          }}
        >
          <Text style={styles.buttonLabelStyle}>{t('Privacy & Policy')}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={async () => {
            await resetShoppingCart();
            deactivateCustomerToken();
          }}
        >
          <Text style={[styles.buttonLabelStyle, styles.redTextColor]}>
            {t('Log Out')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  profileContainer: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
    flexDirection: 'row',
    padding: 24,
  },
  profile: {
    justifyContent: 'center',
    paddingLeft: 16,
  },
  menuContainer: {
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.lightGrey,
  },
  buttonLabelStyle: {
    fontSize: FONT_SIZE.medium,
    fontFamily: FONT_FAMILY.MEDIUM,
  },
  redTextColor: {
    color: COLORS.red,
  },
  menuItem: {
    marginVertical: 12,
  },
  nameTextStyle: {
    fontSize: FONT_SIZE.medium,
    marginBottom: 6,
  },
  emailTextStyle: {
    opacity: 0.6,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

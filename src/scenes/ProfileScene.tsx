import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, ActivityIndicator, Button } from 'exoflex';
import { useNavigation } from '@react-navigation/native';

import { FONT_SIZE, FONT_FAMILY } from '../constants/fonts';
import { COLORS } from '../constants/colors';
import { StackNavProp } from '../types/Navigation';
import { useGetAuthenticatedUser } from '../hooks/api/useAuthenticatedUser';
import { useAuth } from '../helpers/useAuth';
import { Avatar } from '../core-ui';
import { useDeactivateCustomerToken } from '../hooks/api/useCustomer';

export default function ProfileScene() {
  let { navigate } = useNavigation<StackNavProp<'Profile'>>();
  let { authToken, setAuthToken } = useAuth();

  let {
    data: authenticatedUser,
    loading: getAuthenticatedUserLoading,
  } = useGetAuthenticatedUser();

  let { deactivateCustomerToken } = useDeactivateCustomerToken({
    variables: { customerAccessToken: authToken },
    onCompleted: () => onLogout(),
  });

  if (getAuthenticatedUserLoading || !authenticatedUser) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  let onLogout = () => {
    setAuthToken(null);
    navigate('Profile');
  };

  let { email, firstName, lastName } = authenticatedUser.authenticatedUser;

  if (!authToken) {
    // TODO: Render LockedFeature Scene
    return (
      <View>
        <Button onPress={() => navigate('Auth', { initialRouteKey: 'Login' })}>
          Go to Login
        </Button>
        <Button
          onPress={() => navigate('Auth', { initialRouteKey: 'Register' })}
        >
          Go to Register
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
          onPress={() => navigate('AddressManagement')}
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
      </View>
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => deactivateCustomerToken()}
        >
          <Text style={[styles.buttonLabelStyle, styles.redTextColor]}>
            {t('Log Out')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

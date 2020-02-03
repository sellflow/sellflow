import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
  ActivityIndicator,
} from 'react-native';
import { Text, Avatar } from 'exoflex';
import { useNavigation } from '@react-navigation/native';

import { FONT_SIZE, FONT_FAMILY } from '../constants/fonts';
import { COLORS } from '../constants/colors';
import { profile } from '../../assets/images';
import { StackNavProp } from '../types/Navigation';
import { useMutation, useQuery } from '@apollo/react-hooks';
import {
  SET_AUTHENTICATED_USER,
  GET_AUTHENTICATED_USER,
} from '../graphql/client/clientQueries';
import {
  SetAuthenticatedUser,
  SetAuthenticatedUserVariables,
} from '../generated/client/SetAuthenticatedUser';
import { GetAuthenticatedUser } from '../generated/client/GetAuthenticatedUser';

export default function ProfileScene() {
  let { navigate, reset } = useNavigation<StackNavProp<'Profile'>>();

  let [logout] = useMutation<
    SetAuthenticatedUser,
    SetAuthenticatedUserVariables
  >(SET_AUTHENTICATED_USER, {
    variables: {
      user: {
        email: '',
        expiresAt: '',
        id: '',
        firstName: '',
        lastName: '',
      },
    },
    onCompleted: () => {
      AsyncStorage.setItem('accessToken', '');
      // TODO: We probably don't want to navigate anywhere.
      reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    },
  });
  let { loading, data } = useQuery<GetAuthenticatedUser>(
    GET_AUTHENTICATED_USER,
    {
      fetchPolicy: 'cache-only',
      notifyOnNetworkStatusChange: true,
    },
  );

  if (loading || !data) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  let { email, firstName, lastName } = data.authenticatedUser;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.profileContainer}
        onPress={() => navigate('EditProfile')}
      >
        <Avatar.Image source={profile} size={84} />
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
          onPress={() => navigate('EditProfile')}
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
          onPress={() => navigate('OrderHistory')}
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
          onPress={() => {
            logout();
          }}
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

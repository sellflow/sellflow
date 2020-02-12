import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { IconButton, Text } from 'exoflex';
import { Route } from '@react-navigation/native';

import {
  HomeScene,
  WishlistScene,
  ProfileScene,
  OrderDetailsScene,
  OrderHistoryScene,
  ProductDetailsScene,
  ProductCollectionScene,
  RegisterScene,
  LoginScene,
  ForgotPasswordScene,
  ShoppingCartScene,
  CheckoutScene,
  AddressManagementScene,
  EditProfileScene,
  PaymentScene,
} from '../scenes';
import { headerOptions } from '../constants/theme';
import { COLORS } from '../constants/colors';
import {
  StackParamList,
  StackRouteName,
  TabRouteName,
} from '../types/Navigation';
import { FONT_SIZE } from '../constants/fonts';

const Stack = createStackNavigator<StackParamList>();

type HeaderIconButtonProps = {
  icon: string;
  onPress: () => void;
};

type HeaderTextButtonProps = {
  text: string;
  onPress: () => void;
};

function HeaderIconButton(props: HeaderIconButtonProps) {
  let { icon, onPress } = props;
  return (
    <IconButton
      icon={icon}
      onPress={onPress}
      color={COLORS.primaryColor}
      style={styles.headerButton}
    />
  );
}

function HeaderTextButton(props: HeaderTextButtonProps) {
  let { text, onPress } = props;
  return (
    <TouchableOpacity onPress={onPress} style={styles.headerTextButton}>
      <Text weight="500" style={styles.headerRightText}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

export default function StackNavigator({
  route,
}: {
  route: Route<TabRouteName>;
}) {
  let initialRouteName: StackRouteName;
  if (route.name === 'HomeTab') {
    initialRouteName = 'Home';
  } else if (route.name === 'WishlistTab') {
    initialRouteName = 'Wishlist';
  } else {
    initialRouteName = 'Profile';
  }

  return (
    <Stack.Navigator
      screenOptions={headerOptions}
      headerMode="screen"
      initialRouteName={initialRouteName}
    >
      <Stack.Screen
        name="Home"
        component={HomeScene}
        options={({ navigation }) => ({
          title: t('Hello'),
          headerRight: () => (
            <HeaderIconButton
              icon="cart"
              onPress={() => navigation.navigate('ShoppingCart')}
            />
          ),
          headerStyle: {
            shadowColor: COLORS.transparent,
            elevation: 0,
          },
        })}
      />
      <Stack.Screen name="Wishlist" component={WishlistScene} />
      <Stack.Screen name="Profile" component={ProfileScene} />
      <Stack.Screen
        name="Login"
        component={LoginScene}
        options={({ navigation }) => ({
          title: t('Log In'),
          headerRight: () => (
            <HeaderTextButton
              text={t('Register')}
              onPress={() => navigation.replace('Register')}
            />
          ),
        })}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScene}
        options={() => ({
          title: t('Forgot Password'),
          cardStyle: {
            backgroundColor: COLORS.white,
          },
        })}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScene}
        options={({ navigation }) => ({
          title: t('Register'),
          headerRight: () => (
            <HeaderTextButton
              text={t('Log In')}
              onPress={() => navigation.replace('Login')}
            />
          ),
        })}
      />
      <Stack.Screen
        name="AddressManagement"
        component={AddressManagementScene}
        options={() => ({
          title: t('Manage Addresses'),
        })}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScene}
        options={() => ({
          title: t('Edit Profile'),
        })}
      />
      <Stack.Screen
        name="OrderHistory"
        component={OrderHistoryScene}
        options={() => ({
          title: t('Order History'),
          cardStyle: {
            backgroundColor: COLORS.darkWhite,
          },
        })}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetailsScene}
        options={() => ({
          title: t('Order Details'),
        })}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScene}
        options={({ navigation }) => ({
          title: t('Product Details'),
          headerRight: () => (
            <HeaderIconButton
              icon="cart"
              onPress={() => navigation.navigate('ShoppingCart')}
            />
          ),
        })}
      />
      <Stack.Screen
        name="ShoppingCart"
        component={ShoppingCartScene}
        options={() => ({
          title: t('Shopping Cart'),
        })}
      />
      <Stack.Screen
        name="ProductCollection"
        component={ProductCollectionScene}
        options={({ navigation, route }) => ({
          title:
            (route.params.collection && route.params.collection.title) ||
            'Search Results',
          headerRight: () => (
            <HeaderIconButton
              icon="magnify"
              onPress={() => navigation.navigate('Search')}
            />
          ),
        })}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScene}
        options={() => ({
          title: t('Checkout'),
        })}
      />
      <Stack.Screen
        name="Payment"
        component={PaymentScene}
        options={() => ({
          title: t('Payment'),
        })}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerTextButton: {
    marginRight: 16,
  },
  headerRightText: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.primaryColor,
    textAlign: 'right',
  },
  headerButton: {
    marginRight: 8,
  },
});

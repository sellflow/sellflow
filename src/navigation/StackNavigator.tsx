import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { IconButton, Text } from 'exoflex';

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
  ShoppingCartScene,
  CheckoutScene,
  AddressManagementScene,
  SearchScene,
  EditProfileScene,
} from '../scenes';
import { headerOptions } from '../constants/theme';
import { COLORS } from '../constants/colors';
import { RootParamList } from '../types/Navigation';
import { FONT_SIZE } from '../constants/fonts';

const Stack = createStackNavigator<RootParamList>();

type HeaderProps = {
  onPress: () => void;
};

function HeaderLeft(props: HeaderProps) {
  return (
    <IconButton
      icon="chevron-left"
      onPress={props.onPress}
      color={COLORS.primaryColor}
    />
  );
}

function Home() {
  return (
    <Stack.Navigator screenOptions={headerOptions} headerMode="screen">
      <Stack.Screen name="Home" component={HomeScene} />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScene}
        options={({ navigation }) => {
          return {
            title: t('Product Detail'),
            headerLeft: () => (
              <HeaderLeft onPress={() => navigation.navigate('Home')} /> // TODO: Change route
            ),
            headerRight: () => (
              <IconButton
                icon="cart"
                onPress={() => navigation.navigate('Home')}
                color={COLORS.primaryColor}
              />
            ),
          };
        }}
      />
      <Stack.Screen
        name="ShoppingCart"
        component={ShoppingCartScene}
        options={({ navigation }) => {
          return {
            title: t('Shopping Cart'),
            headerLeft: () => (
              <HeaderLeft onPress={() => navigation.navigate('Home')} /> // TODO: Change route
            ),
          };
        }}
      />
      <Stack.Screen
        name="ProductCollection"
        component={ProductCollectionScene}
        options={({ navigation }) => {
          return {
            title: t('Jackets'), // TODO: Change to corresponding product collection name
            headerLeft: () => (
              <HeaderLeft onPress={() => navigation.navigate('Home')} /> // TODO: Change route
            ),
            headerRight: () => (
              <IconButton
                icon="magnify"
                onPress={() => navigation.navigate('Search')}
                color={COLORS.primaryColor}
              />
            ),
          };
        }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScene}
        options={({ navigation }) => {
          return {
            title: t('Checkout'),
            headerLeft: () => (
              <HeaderLeft onPress={() => navigation.navigate('Home')} /> // TODO: Change route
            ),
          };
        }}
      />
      <Stack.Screen
        name="Search"
        component={SearchScene}
        options={({ navigation }) => {
          return {
            title: t('Search'),
            headerLeft: () => (
              <HeaderLeft onPress={() => navigation.goBack()} /> // TODO: Change route
            ),
            cardStyle: {
              backgroundColor: COLORS.darkWhite,
            },
            headerStyle: {
              shadowColor: COLORS.transparent,
            },
          };
        }}
      />
    </Stack.Navigator>
  );
}

function Wishlist() {
  return (
    <Stack.Navigator screenOptions={headerOptions} headerMode="screen">
      <Stack.Screen name="Wishlist" component={WishlistScene} />
    </Stack.Navigator>
  );
}

function Profile() {
  return (
    <Stack.Navigator screenOptions={headerOptions} headerMode="screen">
      <Stack.Screen name="Profile" component={ProfileScene} />
      <Stack.Screen
        name="Login"
        component={LoginScene}
        options={({ navigation }) => {
          return {
            title: t('Log in'),
            headerLeft: () => (
              <HeaderLeft onPress={() => navigation.navigate('Profile')} /> // TODO: Change route
            ),
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
                style={styles.headerRight}
              >
                <Text weight="500" style={styles.headerRightText}>
                  {t('Register')}
                </Text>
              </TouchableOpacity>
            ),
          };
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScene}
        options={({ navigation }) => {
          return {
            title: t('Register'),
            headerLeft: () => (
              <HeaderLeft onPress={() => navigation.navigate('Profile')} /> // TODO: Change route
            ),
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                style={styles.headerRight}
              >
                <Text weight="500" style={styles.headerRightText}>
                  {t('Log In')}
                </Text>
              </TouchableOpacity>
            ),
          };
        }}
      />
      <Stack.Screen
        name="AddressManagement"
        component={AddressManagementScene}
        options={({ navigation }) => {
          return {
            title: t('Manage Addresses'),
            headerLeft: () => (
              <HeaderLeft onPress={() => navigation.navigate('Profile')} />
            ),
          };
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScene}
        options={({ navigation }) => {
          return {
            title: t('Edit Profile'),
            headerLeft: () => (
              <HeaderLeft onPress={() => navigation.navigate('Profile')} /> // TODO: Change route
            ),
          };
        }}
      />
      <Stack.Screen
        name="OrderHistory"
        component={OrderHistoryScene}
        options={({ navigation }) => {
          return {
            title: t('Order History'),
            headerLeft: () => (
              <HeaderLeft onPress={() => navigation.navigate('Profile')} /> // TODO: Change route
            ),
            cardStyle: {
              backgroundColor: COLORS.darkWhite,
            },
          };
        }}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetailsScene}
        options={({ navigation }) => {
          return {
            title: t('Order Details'),
            headerLeft: () => (
              <HeaderLeft onPress={() => navigation.navigate('OrderHistory')} /> // TODO: Change route
            ),
          };
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    marginRight: 16,
  },
  headerRightText: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.primaryColor,
    textAlign: 'right',
  },
});

export { Home, Wishlist, Profile };

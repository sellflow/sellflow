import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { IconButton, Button, Text } from 'exoflex';

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
  SearchScene,
  EditProfileScene,
  PaymentScene,
} from '../scenes';
import { headerOptions } from '../constants/theme';
import { COLORS } from '../constants/colors';
import { RootParamList } from '../types/Navigation';
import { FONT_SIZE } from '../constants/fonts';

const Stack = createStackNavigator<RootParamList>();

type HeaderProps = {
  onPress: () => void;
};

type HomeHeaderProps = {
  onPressRightIcon: () => void;
  onPressSearch: () => void;
};

function HeaderLeft(props: HeaderProps) {
  let { onPress } = props;

  return (
    <IconButton
      icon="chevron-left"
      onPress={onPress}
      color={COLORS.primaryColor}
      style={styles.backArrowIcon}
    />
  );
}

function HeaderRight(props: HeaderProps) {
  let { onPress } = props;

  return (
    <IconButton icon="cart" onPress={onPress} color={COLORS.primaryColor} />
  );
}

function HeaderHome(props: HomeHeaderProps) {
  let { onPressRightIcon, onPressSearch } = props;

  return (
    <View style={styles.homeNavbar}>
      <View style={styles.navbarContainer}>
        <View />
        <Text style={styles.title}>{t('Hello')}</Text>
        <HeaderRight onPress={onPressRightIcon} />
      </View>
      <Button
        style={styles.buttonContainer}
        contentStyle={styles.buttonContent}
        onPress={onPressSearch}
      >
        <Text style={styles.searchText}>Search</Text>
      </Button>
    </View>
  );
}

function Home() {
  return (
    <Stack.Navigator screenOptions={headerOptions} headerMode="screen">
      <Stack.Screen
        name="Home"
        component={HomeScene}
        options={({ navigation }) => {
          return {
            header: () => (
              <HeaderHome
                onPressRightIcon={() => navigation.navigate('Payment')}
                onPressSearch={() => navigation.navigate('Search')}
              />
            ),
          };
        }}
      />
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
              <HeaderRight
                onPress={() => navigation.navigate('ShoppingCart')}
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
        options={({ navigation, route }) => {
          return {
            title: route.params.collection.name,
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
      <Stack.Screen
        name="Payment"
        component={PaymentScene}
        options={({ navigation }) => {
          return {
            title: t('Payment'),
            headerLeft: () => (
              <HeaderLeft onPress={() => navigation.goBack()} /> // TODO: Change route
            ),
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
        name="ForgotPassword"
        component={ForgotPasswordScene}
        options={({ navigation }) => {
          return {
            title: t('Forgot Password'),
            headerLeft: () => (
              <HeaderLeft onPress={() => navigation.navigate('Login')} /> // TODO: Change route
            ),
            cardStyle: {
              backgroundColor: COLORS.white,
            },
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
                onPress={() => navigation.navigate('Register')}
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
  backArrowIcon: {
    marginTop: 12,
  },
  homeNavbar: {
    marginTop: 30,
  },
  navbarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    marginLeft: 50,
    fontSize: FONT_SIZE.large,
  },
  buttonContainer: {
    marginVertical: 16,
    marginHorizontal: 24,
    backgroundColor: COLORS.darkWhite,
  },
  buttonContent: {
    justifyContent: 'flex-start',
    paddingHorizontal: 12,
  },
  searchText: {
    opacity: 0.6,
    color: COLORS.black,
    fontSize: FONT_SIZE.medium,
  },
});

export { Home, Wishlist, Profile };

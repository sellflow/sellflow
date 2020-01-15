import React from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import { IconButton } from 'exoflex';

import {
  HomeScene,
  WishlistScene,
  ProfileScene,
  OrderHistoryScene,
  OrderDetailsScene,
  ProductDetailsScene,
  ProductCollectionScene,
} from '../scenes';
import { headerOptions } from '../constants/theme';
import { COLORS } from '../constants/colors';
import { RootParamList } from '../types/Navigation';
import ShoppingCartScene from '../scenes/ShoppingCartScene';

const Stack = createStackNavigator<RootParamList>();

type HeaderProps = {
  navigation: StackNavigationProp<RootParamList>;
  routeName: keyof RootParamList;
};

function HeaderLeft(props: HeaderProps) {
  let { navigation, routeName } = props;

  return (
    <IconButton
      icon="chevron-left"
      onPress={() => navigation.navigate(routeName)}
      color={COLORS.primaryColor}
    />
  );
}

function Home() {
  return (
    <Stack.Navigator screenOptions={headerOptions} headerMode="screen">
      <Stack.Screen name="Home" component={HomeScene} />
      <Stack.Screen
        name="OrderHistory"
        component={OrderHistoryScene}
        options={({ navigation }) => {
          return {
            title: t('Order History'),
            headerLeft: () => (
              <HeaderLeft navigation={navigation} routeName="Home" /> // TODO: Change route
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
              <HeaderLeft navigation={navigation} routeName="Home" /> // TODO: Change route
            ),
            cardStyle: {
              backgroundColor: COLORS.darkWhite,
            },
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
              <HeaderLeft navigation={navigation} routeName="Home" /> // TODO: Change route
            ),
            headerRight: () => (
              <IconButton
                icon="cart"
                onPress={() => navigation.navigate('Home')}
                color={COLORS.primaryColor}
              />
            ),
            cardStyle: {
              backgroundColor: COLORS.white,
            },
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
              <HeaderLeft navigation={navigation} routeName="Home" /> // TODO: Change route
            ),
            cardStyle: {
              backgroundColor: COLORS.darkWhite,
            },
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
              <HeaderLeft navigation={navigation} routeName="Home" /> // TODO: Change route
            ),
            headerRight: () => (
              <IconButton
                icon="magnify"
                onPress={() => navigation.navigate('Home')}
                color={COLORS.primaryColor}
              />
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
      <Stack.Screen
        name="Profile"
        component={ProfileScene}
        options={{
          title: t('My Profile'),
        }}
      />
    </Stack.Navigator>
  );
}

export { Home, Wishlist, Profile };

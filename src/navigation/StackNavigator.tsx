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
} from '../scenes';
import { headerOptions } from '../constants/theme';
import { COLORS } from '../constants/colors';
import { RootParamList } from '../types/Navigation';

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

function HeaderRightProductDetails(props: HeaderProps) {
  let { navigation, routeName } = props;

  return (
    <IconButton
      icon="cart"
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
              <HeaderRightProductDetails
                navigation={navigation}
                routeName="Home"
              /> // TODO: Change route
            ),
            cardStyle: {
              backgroundColor: COLORS.white,
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
    </Stack.Navigator>
  );
}

export { Home, Wishlist, Profile };

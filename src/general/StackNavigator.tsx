import React from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native';
import { IconButton } from 'exoflex';

import {
  HomeScene,
  WishlistScene,
  ProfileScene,
  OrderHistoryScene,
} from '../scenes';
import { headerOptions } from '../constants/theme';
import { COLORS } from '../constants/colors';

const Stack = createStackNavigator();

type HeaderProps = {
  navigation: StackNavigationProp<ParamListBase>;
  routeName: string;
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
              <HeaderLeft navigation={navigation} routeName={'Home'} /> // TODO: Change route
            ),
            cardStyle: {
              backgroundColor: COLORS.darkWhite,
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

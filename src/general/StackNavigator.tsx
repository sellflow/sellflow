import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { HomeScene, WishlistScene, ProfileScene } from '../scenes';
import { headerOptions } from '../constants/theme';

const Stack = createStackNavigator();

function Home() {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen name="Home" component={HomeScene} />
    </Stack.Navigator>
  );
}

function Wishlist() {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen name="Wishlist" component={WishlistScene} />
    </Stack.Navigator>
  );
}

function Profile() {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen name="Profile" component={ProfileScene} />
    </Stack.Navigator>
  );
}

export { Home, Wishlist, Profile };

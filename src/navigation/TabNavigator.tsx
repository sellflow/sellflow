import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { IconButton, Text } from 'exoflex';

import { FONT_SIZE } from '../constants/fonts';
import { tabBarOptions } from '../constants/theme';
import { TabParamList } from '../types/Navigation';
import { HomeScene, WishlistScene, ProfileScene, LockScene } from '../scenes';
import { useAuth } from '../helpers/useAuth';

const Tab = createBottomTabNavigator<TabParamList>();

type LabelProps = {
  focused: boolean;
  color: string;
  label: string;
};

function TabLabel(props: LabelProps) {
  let { focused, color, label } = props;
  return (
    <Text
      {...(focused && { weight: 'medium' })}
      style={{ color, fontSize: FONT_SIZE.extraSmall, marginTop: 10 }}
    >
      {label}
    </Text>
  );
}

export default function TabNavigator() {
  let { authToken } = useAuth();
  return (
    <Tab.Navigator initialRouteName="HomeTab" tabBarOptions={tabBarOptions}>
      <Tab.Screen
        name="HomeTab"
        component={HomeScene}
        options={() => {
          return {
            title: t('Home'),
            tabBarLabel: ({ focused, color }) => (
              <TabLabel focused={focused} color={color} label={t('Home')} />
            ),
            tabBarIcon: ({ color }) => <IconButton icon="home" color={color} />,
          };
        }}
      />
      <Tab.Screen
        name="WishlistTab"
        component={WishlistScene}
        options={() => {
          return {
            title: t('Wishlist'),
            tabBarLabel: ({ focused, color }) => (
              <TabLabel focused={focused} color={color} label={t('Wishlist')} />
            ),
            tabBarIcon: ({ color }) => (
              <IconButton icon="heart" color={color} />
            ),
          };
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={authToken ? ProfileScene : LockScene}
        options={() => {
          return {
            title: t('Profile'),
            tabBarVisible: !!authToken,
            tabBarLabel: ({ focused, color }) => (
              <TabLabel
                focused={focused}
                color={color}
                label={t('My Profile')}
              />
            ),
            tabBarIcon: ({ color }) => (
              <IconButton icon="account" color={color} />
            ),
          };
        }}
      />
    </Tab.Navigator>
  );
}

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { IconButton, Text } from 'exoflex';

import { FONT_SIZE } from '../constants/fonts';
import { tabBarOptions } from '../constants/theme';
import { Home, Wishlist, Profile } from './StackNavigator';

const Tab = createBottomTabNavigator();

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
  return (
    <Tab.Navigator initialRouteName="Home" tabBarOptions={tabBarOptions}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: ({ focused, color }) => (
            <TabLabel focused={focused} color={color} label={t('Home')} />
          ),
          tabBarIcon: ({ color }) => <IconButton icon="home" color={color} />,
        }}
      />
      <Tab.Screen
        name="Wishlist"
        component={Wishlist}
        options={{
          tabBarLabel: ({ focused, color }) => (
            <TabLabel focused={focused} color={color} label={t('Wishlist')} />
          ),
          tabBarIcon: ({ color }) => (
            <IconButton icon="favorite" color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: ({ focused, color }) => (
            <TabLabel focused={focused} color={color} label={t('My Profile')} />
          ),
          tabBarIcon: ({ color }) => <IconButton icon="person" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

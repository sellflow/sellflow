import React from 'react';
import { NavigationNativeContainer } from '@react-navigation/native';

import TabNavigator from './TabNavigator';

export default function AppNavigator() {
  return (
    <NavigationNativeContainer>
      <TabNavigator />
    </NavigationNativeContainer>
  );
}

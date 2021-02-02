import React from 'react';
import { NavigationNativeContainer } from '@react-navigation/native';

import StackNavigator from './StackNavigator';

export default function AppNavigator() {
  return (
    <NavigationNativeContainer>
      <StackNavigator />
    </NavigationNativeContainer>
  );
}

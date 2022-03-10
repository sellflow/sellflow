import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import StackNavigator from './StackNavigator';

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}

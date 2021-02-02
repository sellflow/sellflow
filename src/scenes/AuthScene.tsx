import React from 'react';
import { useRoute } from '@react-navigation/native';

import TabView from '../core-ui/TabView';
import { StackRouteProp } from '../types/Navigation';
import { TabRoute } from '../types/types';

import LoginScene from './LoginScene';
import RegisterScene from './RegisterScene';

export default function AuthScene() {
  const FirstRoute = LoginScene;
  const SecondRoute = RegisterScene;
  let route = useRoute<StackRouteProp<'Auth'>>();
  let { initialRouteKey } = route.params;
  const routes: Array<TabRoute> = [
    { key: 'Login', title: 'Login', scene: FirstRoute },
    { key: 'Register', title: 'Register', scene: SecondRoute },
  ];
  return (
    <TabView
      isScrollEnabled={false}
      routes={routes}
      initialRouteKey={initialRouteKey}
    />
  );
}

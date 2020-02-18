import React from 'react';
import { useRoute } from '@react-navigation/native';

import TabView, { TabRoute } from '../core-ui/TabView';
import LoginScene from './LoginScene';
import RegisterScene from './RegisterScene';
import { StackRouteProp } from '../types/Navigation';

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

import React from 'react';

import { useRoute } from '@react-navigation/native';

import { TabView } from '../core-ui';
import { StackRouteProp } from '../types/Navigation';
import { TabRoute } from '../types/types';
import LoginScene from './LoginScene';
import RegisterScene from './RegisterScene';

export default function AuthScene() {
  let {
    params: { initialRouteKey },
  } = useRoute<StackRouteProp<'Auth'>>();
  const routes: Array<TabRoute> = [
    { key: 'Login', title: 'Login', scene: LoginScene },
    { key: 'Register', title: 'Register', scene: RegisterScene },
  ];
  return (
    <TabView
      isScrollEnabled={false}
      routes={routes}
      initialRouteKey={initialRouteKey}
    />
  );
}

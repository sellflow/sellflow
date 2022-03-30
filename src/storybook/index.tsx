import '../polyfills';
import '../filterWarnings';

import { registerRootComponent } from 'expo';
import { useFonts } from 'expo-font';
import React from 'react';
import { ActivityIndicator, Provider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { configure, getStorybookUI } from '@storybook/react-native';

import { CustomTheme } from '../constants/theme';

configure(() => {
  require('./stories');
}, module);

const StorybookUIRoot = getStorybookUI({
  onDeviceUI: true,
  disableWebsockets: true,
  asyncStorage: AsyncStorage || null,
});

function App() {
  let [fontsLoaded] = useFonts({
    'SourceSansPro-Regular': require('../../assets/fonts/SourceSansPro-Regular.ttf'),
    'SourceSansPro-Italic': require('../../assets/fonts/SourceSansPro-Italic.ttf'),
    'SourceSansPro-Bold': require('../../assets/fonts/SourceSansPro-Bold.ttf'),
    'SourceSansPro-SemiBold': require('../../assets/fonts/SourceSansPro-SemiBold.ttf'),
  });

  if (!fontsLoaded) {
    return <ActivityIndicator />;
  }

  return (
    <Provider theme={CustomTheme}>
      <StorybookUIRoot />
    </Provider>
  );
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
registerRootComponent(App as any);

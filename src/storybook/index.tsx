import '../polyfills';
import '../filterWarnings';
import React from 'react';
import { registerRootComponent } from 'expo';
import { getStorybookUI, configure } from '@storybook/react-native';
import { Provider } from 'exoflex';

import { CustomTheme } from '../constants/theme';

configure(() => {
  require('./stories');
}, module);

const StorybookUIRoot = getStorybookUI({
  onDeviceUI: true,
  disableWebsockets: true,
  asyncStorage: require('react-native').AsyncStorage || null,
});

function App() {
  return (
    <Provider theme={CustomTheme}>
      <StorybookUIRoot />
    </Provider>
  );
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
registerRootComponent(App as any);

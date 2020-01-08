import '../polyfills';
import React from 'react';
import { registerRootComponent } from 'expo';
import { getStorybookUI, configure } from '@storybook/react-native';
import { Provider } from 'exoflex';

import { CustomTheme } from '../general/constants/theme';
import { fonts } from '../general/constants/fonts';

configure(() => {
  require('./stories');
}, module);

const StorybookUIRoot = getStorybookUI({});

function App() {
  return (
    <Provider theme={CustomTheme} fonts={fonts} useSystemFonts={false}>
      <StorybookUIRoot />
    </Provider>
  );
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
registerRootComponent(App as any);

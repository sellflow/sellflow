import React from 'react';
import { registerRootComponent } from 'expo';
import { getStorybookUI, configure } from '@storybook/react-native';
import { Provider } from 'exoflex';

configure(() => {
  require('./stories');
}, module);

const StorybookUIRoot = getStorybookUI({});

function App() {
  return (
    <Provider>
      <StorybookUIRoot />
    </Provider>
  );
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
registerRootComponent(App as any);

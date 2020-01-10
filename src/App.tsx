import './polyfills';
import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { Provider as ThemeProvider } from 'exoflex';

import { client } from './graphql/client';
import { CustomTheme } from './constants/theme';
import { fonts } from './constants/fonts';
import AppNavigator from './general/AppNavigator';

export default function App() {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={CustomTheme} fonts={fonts} useSystemFonts={false}>
        <AppNavigator />
      </ThemeProvider>
    </ApolloProvider>
  );
}

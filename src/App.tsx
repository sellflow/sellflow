import './polyfills';
import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { Provider as ThemeProvider } from 'exoflex';

import { client } from './graphql/client';
import { CustomTheme } from './constants/theme';
import AppNavigator from './general/AppNavigator';

function App() {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={CustomTheme}>
        <AppNavigator />
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;

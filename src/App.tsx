import './filterWarnings';
import './polyfills';
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { ApolloProvider } from '@apollo/react-hooks';
import { Provider as ThemeProvider } from 'exoflex';

import { client } from './graphql/client';
import { CustomTheme } from './constants/theme';
import AppNavigator from './navigation/AppNavigator';

function App() {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={CustomTheme}>
        <SafeAreaView style={styles.container}>
          <AppNavigator />
        </SafeAreaView>
      </ThemeProvider>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;

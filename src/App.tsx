import './filterWarnings';
import './polyfills';
import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import {
  Provider as ThemeProvider,
  ActivityIndicator,
} from 'react-native-paper';
import { StatusBar } from 'react-native';
import { useFonts } from 'expo-font';

import { Provider as AuthProvider } from '../src/helpers/useAuth';

import { client } from './graphql/client';
import { CustomTheme } from './constants/theme';
import AppNavigator from './navigation/AppNavigator';

function App() {
  let [fontsLoaded] = useFonts({
    'SourceSansPro-Regular': require('../assets/fonts/SourceSansPro-Regular.ttf'),
    'SourceSansPro-Italic': require('../assets/fonts/SourceSansPro-Italic.ttf'),
    'SourceSansPro-Bold': require('../assets/fonts/SourceSansPro-Bold.ttf'),
    'SourceSansPro-SemiBold': require('../assets/fonts/SourceSansPro-SemiBold.ttf'),
  });

  if (!fontsLoaded) {
    return <ActivityIndicator />;
  }

  return (
    <ApolloProvider client={client}>
      <StatusBar barStyle="dark-content" />
      <ThemeProvider theme={CustomTheme}>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;

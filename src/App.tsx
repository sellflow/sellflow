import './filterWarnings';
import './polyfills';

import { useFonts } from 'expo-font';
import React from 'react';
import { I18nManager, StatusBar } from 'react-native';
import {
  ActivityIndicator,
  Provider as ThemeProvider,
} from 'react-native-paper';
import { ApolloProvider } from '@apollo/react-hooks';

import { Provider as AuthProvider } from '../src/helpers/useAuth';
import { Provider as NetworkProvider } from '../src/helpers/useNetwork';

import { CustomTheme } from './constants/theme';
import { client } from './graphql/client';
import AppNavigator from './navigation/AppNavigator';

I18nManager.forceRTL(CustomTheme.isRTL); // experimental

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
        <NetworkProvider>
          <AuthProvider>
            <AppNavigator />
          </AuthProvider>
        </NetworkProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ApolloProvider } from '@apollo/react-hooks';
import { Provider as ThemeProvider, Text } from 'exoflex';

import { client } from './graphql/client';
import { CustomTheme } from './general/constants/theme';
import { fonts } from './general/constants/fonts';

export default function App() {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={CustomTheme} fonts={fonts} useSystemFonts={false}>
        <View style={styles.container}>
          <Text>Open up App.tsx to start working on your app!</Text>
        </View>
      </ThemeProvider>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

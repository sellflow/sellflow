import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { WebView } from 'react-native-webview';

import { useNavigation, useRoute } from '@react-navigation/native';

import { Text } from '../core-ui';
import { useResetCart } from '../hooks/api/useShoppingCart';
import { StackNavProp, StackRouteProp } from '../types/Navigation';

export default function WebScene() {
  let {
    params: { type, webUrl },
  } = useRoute<StackRouteProp<'WebView'>>();
  let { navigate, setOptions } = useNavigation<StackNavProp<'WebView'>>();
  let { resetShoppingCart } = useResetCart();

  let title: string;

  switch (type) {
    case 'policy':
      title = t('Privacy Policy');
      break;
    case 'terms':
      title = t('Terms & Conditions');
      break;
    default:
      title = t('Payment');
  }
  useEffect(() => {
    setOptions({
      title,
    });
  });

  return webUrl ? (
    <SafeAreaView style={styles.flex}>
      <WebView
        style={styles.container}
        source={{ uri: webUrl }}
        originWhitelist={['*']}
        onShouldStartLoadWithRequest={({ url }) => {
          if (url.endsWith('thank_you')) {
            resetShoppingCart();
            navigate('OrderPlacedConfirmation', { orderNumber: '' });
            return false;
          }
          return true;
        }}
        startInLoadingState={true}
        renderLoading={() => <ActivityIndicator style={styles.center} />}
      />
    </SafeAreaView>
  ) : (
    <SafeAreaView style={styles.text}>
      <Text>{t('Please check your connection.')}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    marginVertical: 24,
  },
  center: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  text: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

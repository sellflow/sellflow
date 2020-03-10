import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';

import { useRoute, useNavigation } from '@react-navigation/native';
import { StackRouteProp, StackNavProp } from '../../types/Navigation';
import { useResetCart } from '../../hooks/api/useShoppingCart';
import { ActivityIndicator } from 'exoflex';

export default function PaymentScene() {
  let { params } = useRoute<StackRouteProp<'Payment'>>();
  let { navigate } = useNavigation<StackNavProp<'Payment'>>();
  let { resetShoppingCart } = useResetCart();

  return (
    <SafeAreaView style={styles.flex}>
      <WebView
        style={styles.margin}
        source={{ uri: params.webUrl }}
        originWhitelist={['*']}
        onShouldStartLoadWithRequest={({ url }) => {
          if (url.endsWith('thank_you')) {
            resetShoppingCart();
            navigate('Home');
            return false;
          }
          return true;
        }}
        startInLoadingState={true}
        renderLoading={() => <ActivityIndicator style={styles.center} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  margin: {
    marginBottom: 24,
  },
});

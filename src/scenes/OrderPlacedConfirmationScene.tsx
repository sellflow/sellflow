import React from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { successImage } from '../../assets/images';
import { ErrorPage } from '../components';
import { defaultButton, defaultButtonLabel } from '../constants/theme';
import { Button, Text } from '../core-ui';
import { useAuth } from '../helpers/useAuth';
import { useOrderHistory } from '../hooks/api/useOrderHistory';
import useDefaultCountry from '../hooks/api/useDefaultCountry';

export default function OrderPlacedConfirmation() {
  let { reset, navigate } = useNavigation();
  let { authToken } = useAuth();
  let first = 10;

  let { orderHistory, loading, error, refetch } = useOrderHistory(1, authToken);
  let orderNumber = orderHistory.length > 0 ? orderHistory[0].orderNumber : '';
  let {
    data: { countryCode },
  } = useDefaultCountry();

  if (error) {
    return (
      <ErrorPage
        onRetry={() =>
          refetch({
            customerAccessToken: authToken,
            first,
            after: orderHistory[orderHistory.length - 1].cursor || null,
            country: countryCode,
          })
        }
      />
    );
  }

  return loading ? (
    <ActivityIndicator style={styles.centered} />
  ) : (
    <SafeAreaView style={styles.scene}>
      <View style={styles.textView}>
        <Image source={successImage} style={styles.image} />
        <Text style={styles.purchase}>
          {t(
            `Thank you for your purchase! Your order {orderNumber} has been received and will be processed shortly.`,
            { orderNumber },
          )}
        </Text>
      </View>

      <Button
        style={defaultButton}
        labelStyle={defaultButtonLabel}
        onPress={() => {
          reset({
            index: 0,
            routes: [
              {
                name: 'Home',
              },
            ],
          });
          navigate('OrderHistory', {
            customerAccessToken: authToken,
          });
        }}
      >
        {t('View Order History')}
      </Button>

      <Button
        preset="invisible"
        style={styles.backButton}
        labelStyle={defaultButtonLabel}
        onPress={() =>
          reset({
            index: 0,
            routes: [{ name: 'Home' }],
          })
        }
      >
        {t('Back To Home')}
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    justifyContent: 'space-between',
    marginHorizontal: 24,
  },
  textView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  image: {
    maxWidth: 84,
    maxHeight: 84,
  },
  purchase: {
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 100,
    marginHorizontal: 12,
    lineHeight: 24,
  },
  backButton: {
    marginTop: 16,
    marginBottom: 24,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

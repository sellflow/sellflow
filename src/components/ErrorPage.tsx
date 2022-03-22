import React from 'react';
import { Image, SafeAreaView, StyleSheet, View } from 'react-native';

import { defaultButton, defaultButtonLabel } from '../constants/theme';
import { Button, Text } from '../core-ui';
import { ERRORS } from '../constants/values';
import { FONT_SIZE } from '../constants/fonts';
import { COLORS } from '../constants/colors';
import { useNetwork } from '../helpers/useNetwork';
import { NetworkStateEnum } from '../types/types';

type Props = {
  onRetry: () => void;
};

export default function ErrorPage(props: Props) {
  let { isConnected, retryConnection } = useNetwork();
  let { onRetry } = props;

  let errorType: keyof typeof ERRORS =
    isConnected === NetworkStateEnum.CONNECTED ? 'data' : 'noInternet';
  let { title, message, image } = ERRORS[errorType];

  return (
    <SafeAreaView style={styles.flex}>
      <View style={styles.center}>
        <Image
          source={image}
          width={100}
          height={100}
          style={styles.emptyCartImage}
        />
        <Text weight="bold" style={styles.title}>
          {title}
        </Text>
        <Text style={styles.message}>{message}</Text>
        <Button
          style={[defaultButton, styles.buttonStyle]}
          labelStyle={defaultButtonLabel}
          onPress={() => {
            isConnected === NetworkStateEnum.NOT_CONNECTED && retryConnection();
            onRetry();
          }}
        >
          {t('Try Again')}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    marginTop: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 48,
  },
  emptyCartImage: {
    maxWidth: 360,
    maxHeight: 270,
    marginBottom: 24,
  },
  flex: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: FONT_SIZE.large,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: FONT_SIZE.small,
    opacity: 0.6,
    textAlign: 'center',
  },
});

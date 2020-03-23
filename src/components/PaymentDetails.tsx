import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Text } from 'exoflex';

import { Surface } from '../core-ui';
import { FONT_SIZE } from '../constants/fonts';
import { COLORS } from '../constants/colors';
import { PaymentDetailsProps } from '../types/types';

type Props = {
  data: Array<PaymentDetailsProps>;
  containerStyle?: StyleProp<ViewStyle>;
};

export default function PaymentDetails(props: Props) {
  let { data, containerStyle } = props;

  return (
    <Surface containerStyle={[styles.surfacePaymentDetails, containerStyle]}>
      {data.map((item, index) => {
        let { name, value } = item;
        if (data.length - 1 === index) {
          return (
            <View
              style={[styles.innerPaymentDetailsContainer, styles.border]}
              key={name}
            >
              <Text style={styles.mediumText}>{name}</Text>
              <Text weight="medium" style={styles.mediumText}>
                {value}
              </Text>
            </View>
          );
        } else {
          return (
            <View style={styles.innerPaymentDetailsContainer} key={name}>
              <Text style={[styles.mediumText, styles.marginBottom]}>
                {name}
              </Text>
              <Text style={styles.mediumText}>{value}</Text>
            </View>
          );
        }
      })}
    </Surface>
  );
}

const styles = StyleSheet.create({
  innerPaymentDetailsContainer: {
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  surfacePaymentDetails: {
    marginTop: 12,
    paddingHorizontal: 15,
    paddingVertical: 0,
  },

  mediumText: {
    fontSize: FONT_SIZE.medium,
  },
  border: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGrey,
  },
  marginBottom: {
    marginBottom: 6,
  },
});

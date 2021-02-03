import React, { useState } from 'react';
import {
  TouchableOpacity,
  View,
  FlatList,
  TouchableWithoutFeedback,
  Platform,
  Animated,
  StyleSheet,
} from 'react-native';
import { Menu } from 'react-native-paper';
import { useQuery } from '@apollo/react-hooks';
import { IconButton, Text } from 'exoflex';

import { COLORS } from '../constants/colors';
import { GET_SHOP } from '../graphql/server/shop';
import { GetShop } from '../generated/server/GetShop';
import useDefaultCurrency from '../hooks/api/useDefaultCurrency';

export default function CurrencyPicker() {
  let [visible, setVisible] = useState<boolean>(false);
  let { setDefaultCurrency, data: selectedCurrency } = useDefaultCurrency();
  let { data: shopData } = useQuery<GetShop>(GET_SHOP);

  let isMultiCurrency =
    shopData &&
    shopData.shop.paymentSettings.enabledPresentmentCurrencies.length > 1;

  let animatedValue = new Animated.Value(0);

  Animated.timing(animatedValue, {
    toValue: visible ? -180 : 0,
    duration: 300,
  }).start();

  return (
    <View style={styles.container}>
      {isMultiCurrency ? (
        <Menu
          visible={visible}
          onDismiss={() => {
            setVisible(false);
          }}
          anchor={
            <TouchableWithoutFeedback onPress={() => setVisible(true)}>
              <View style={styles.titleContainer}>
                <Text weight="medium">{selectedCurrency}</Text>
                <Animated.View
                  style={{
                    transform: [
                      {
                        rotate: animatedValue.interpolate({
                          inputRange: [-180, 0],
                          outputRange: ['180deg', '0deg'],
                        }),
                      },
                    ],
                  }}
                >
                  <IconButton
                    icon="menu-down"
                    size={18}
                    color={COLORS.primaryColor}
                    style={styles.smallTriangle}
                  />
                </Animated.View>
              </View>
            </TouchableWithoutFeedback>
          }
          contentStyle={[
            Platform.OS === 'ios' && styles.topMargin,
            styles.zeroPadding,
          ]}
        >
          <View style={styles.menuItemContainer}>
            <FlatList
              style={styles.menuListContainer}
              data={
                shopData?.shop.paymentSettings.enabledPresentmentCurrencies ||
                []
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setDefaultCurrency({ variables: { currency: item } });
                    setVisible(false);
                  }}
                >
                  <Text weight="medium">{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
            />
          </View>
        </Menu>
      ) : (
        <Text weight="medium">{selectedCurrency}</Text>
      )}
    </View>
  );
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topMargin: { marginTop: 32 },
  smallTriangle: { margin: 0, height: 18, width: 18 },
  zeroPadding: { paddingVertical: 0 },
  menuItemContainer: {
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.16,
    shadowRadius: 4,
    zIndex: 1,
  },
  menuListContainer: {
    backgroundColor: 'white',
    width: 100,
    maxHeight: 170,
  },
  menuItem: {
    paddingLeft: 16,
    paddingVertical: 14,
    flex: 1,
  },
});

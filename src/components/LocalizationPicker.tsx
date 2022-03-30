import React, { useState } from 'react';
import {
  Animated,
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { IconButton, Menu } from 'react-native-paper';

import { COLORS } from '../constants/colors';
import { Text } from '../core-ui';
import useDefaultCountry from '../hooks/api/useDefaultCountry';
import useLocalization from '../hooks/api/useLocalization';

export default function CurrencyPicker() {
  let [visible, setVisible] = useState(false);
  let {
    setDefaultCountryCode,
    data: selectedCountryCode,
  } = useDefaultCountry();

  let { data } = useLocalization();

  let isMultiCurrency = data && data.localization.availableCountries.length > 1;

  let animatedValue = new Animated.Value(0);

  Animated.timing(animatedValue, {
    toValue: visible ? -180 : 0,
    duration: 300,
    useNativeDriver: true,
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
                <Text weight="medium">{selectedCountryCode.countryCode}</Text>
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
              data={data?.localization.availableCountries || []}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    let { isoCode, currency } = item;
                    setDefaultCountryCode({
                      variables: {
                        countryCode: isoCode,
                        currencyCode: currency.isoCode,
                        currencySymbol: currency.symbol,
                      },
                    });
                    setVisible(false);
                  }}
                >
                  <Text weight="medium">{item.isoCode}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.isoCode}
            />
          </View>
        </Menu>
      ) : (
        <Text weight="medium">{selectedCountryCode.countryCode}</Text>
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

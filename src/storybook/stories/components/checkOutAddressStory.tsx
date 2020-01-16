import React, { useState } from 'react';
import { storiesOf } from '@storybook/react-native';
import { StyleSheet, SafeAreaView, FlatList } from 'react-native';

import { addressItemData } from '../../../fixtures/AddressItemData';
import { CheckoutAddress } from '../../../components';
import { RadioButton } from 'exoflex';

function CheckoutAddressList() {
  let [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <SafeAreaView style={styles.container}>
      <RadioButton.Group value="Address List">
        <FlatList
          data={addressItemData}
          renderItem={({ item }) => (
            <CheckoutAddress
              data={item}
              style={styles.addressItem}
              isSelected={selectedIndex === item.id}
              onSelect={() => setSelectedIndex(item.id)}
            />
          )}
        />
      </RadioButton.Group>
    </SafeAreaView>
  );
}

export default function checkOutAddressStory() {
  return storiesOf('CheckoutAddress', module).add('CheckoutAddress', () => (
    <CheckoutAddressList />
  ));
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
  },
  addressItem: {
    marginBottom: 20,
  },
});

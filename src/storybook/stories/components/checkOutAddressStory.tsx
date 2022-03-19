import React, { useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet } from 'react-native';

import { storiesOf } from '@storybook/react-native';

import { CheckoutAddress } from '../../../components';
import { RadioButton } from '../../../core-ui';
import { addressItemData } from '../../../fixtures/AddressItemData';

function CheckoutAddressList() {
  let [selectedIndex, setSelectedIndex] = useState(addressItemData[0].id);
  return (
    <SafeAreaView style={styles.container}>
      <RadioButton.Group
        // value="Address List"
        onValueChange={(newValue) => setSelectedIndex(newValue)}
        value={selectedIndex}
      >
        <FlatList
          data={addressItemData}
          renderItem={({ item }) => (
            <CheckoutAddress
              onEditPressed={() => {}}
              data={item}
              style={styles.addressItem}
              // isSelected={selectedIndex === item.id}
              // onSelect={() => setSelectedIndex(item.id)}
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

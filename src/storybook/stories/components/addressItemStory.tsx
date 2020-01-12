import React, { useState } from 'react';
import { storiesOf } from '@storybook/react-native';
import { ScrollView, StyleSheet, Alert, SafeAreaView } from 'react-native';

import { AddressItem } from '../../../components';
import { RadioButton } from 'exoflex';

function AddressItemStory() {
  let [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <AddressItem
          style={styles.addressItem}
          name="Anna Belle"
          address="400 Concar Dr, San Mateo, CA 94402"
          primary={true}
          type="manage"
          phoneNumber="650-555-1212"
          onEdit={() => Alert.alert('Edit', 'Edit Clicked')}
          isSelected={selectedIndex === 0}
          onSelect={() => setSelectedIndex(0)}
        />
        <AddressItem
          style={styles.addressItem}
          name="Anna Belle"
          address="1825 S Grant St, San Mateo, CA 94402"
          primary={false}
          type="manage"
          phoneNumber="415-555-1212"
          onEdit={() => Alert.alert('Edit', 'Edit Clicked')}
          isSelected={selectedIndex === 1}
          onSelect={() => setSelectedIndex(1)}
        />
        <RadioButton.Group value="Address List">
          <AddressItem
            style={styles.addressItem}
            name="Anna Belle"
            address="3101 Park Blvd, Palo Alto, CA"
            type="checkout"
            phoneNumber="650-555-1212"
            onEdit={() => Alert.alert('Edit', 'Edit Clicked')}
            isSelected={selectedIndex === 2}
            onSelect={() => setSelectedIndex(2)}
          />
          <AddressItem
            style={styles.addressItem}
            name="Anna Belle"
            address="44 Montgomery St, San Francisco, CA 94104"
            type="checkout"
            phoneNumber="918-555-1212"
            onEdit={() => Alert.alert('Edit', 'Edit Clicked')}
            isSelected={selectedIndex === 3}
            onSelect={() => setSelectedIndex(3)}
          />
        </RadioButton.Group>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function addressItemStory() {
  return storiesOf('AddressItem', module).add('AddressItem', () => (
    <AddressItemStory />
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

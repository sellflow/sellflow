import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { StyleSheet, SafeAreaView, FlatList } from 'react-native';

import { ManageAddress } from '../../../components';
import { addressItemData } from '../../../fixtures/AddressItemData';

function ManageAddressList() {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={addressItemData}
        renderItem={({ item }) => (
          <ManageAddress
            id={item.id}
            name={item.name}
            address={item.address}
            phoneNumber={item.phoneNumber}
            primary={item.default}
          />
        )}
        keyExtractor={(data) => data.id.toString()}
      />
    </SafeAreaView>
  );
}

export default function manageAddressStory() {
  return storiesOf('ManageAddress', module).add('ManageAddress', () => (
    <ManageAddressList />
  ));
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
  },
});

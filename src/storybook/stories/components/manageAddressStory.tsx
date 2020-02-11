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
            data={item}
            onPressSetPrimary={() => {}}
            onPressEdit={() => {}}
            onPressDelete={() => {}}
          />
        )}
        keyExtractor={(data) => data.id}
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

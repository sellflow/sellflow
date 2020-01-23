import React from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Button } from 'exoflex';

import { ManageAddress } from '../components';
import { addressItemData } from '../fixtures/AddressItemData';

export default function AddressManagementScene() {
  let addNewAddress = () => Alert.alert('Add New', 'ToDo Routing'); //TODO Routing to Add Scene

  return (
    <View style={styles.container}>
      <FlatList
        data={addressItemData}
        renderItem={({ item }) => (
          <ManageAddress data={item} style={styles.item} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contentContainer}
      />
      <Button uppercase={true} onPress={addNewAddress} style={styles.bottomBar}>
        {t('Add new address')}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 14,
  },
  item: {
    marginTop: 16,
  },
  contentContainer: {
    paddingHorizontal: 24,
  },
  bottomBar: {
    marginHorizontal: 24,
    marginTop: 20,
  },
});

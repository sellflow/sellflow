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
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
      <Button uppercase={true} onPress={addNewAddress}>
        {t('Add new address')}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    justifyContent: 'space-between',
    flex: 1,
  },
  item: { marginTop: 16 },
  list: { paddingBottom: 16 },
});

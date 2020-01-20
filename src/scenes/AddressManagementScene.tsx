import React from 'react';
import { View, SafeAreaView, FlatList, StyleSheet, Alert } from 'react-native';
import { Button } from 'exoflex';

import { ManageAddress } from '../components';
import { addressItemData } from '../fixtures/AddressItemData';

export default function AddressManagementScene() {
  let addNewAddress = () => Alert.alert('Add New', 'ToDo Routing'); //TODO Routing to Add Scene

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={addressItemData}
        renderItem={({ item }) => (
          <ManageAddress data={item} style={styles.item} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contentContainer}
      />
      <View style={styles.bottomBar}>
        <Button uppercase={true} onPress={addNewAddress}>
          {t('Add new address')}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    marginTop: 16,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  bottomBar: {
    paddingHorizontal: 24,
  },
});

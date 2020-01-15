import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'exoflex';

import SortModal from './components/SortModal';

export default function ProductCollectionScene() {
  let [isModalVisible, setModalVisible] = useState(false);
  let [radioButtonValue, setRadioButtonValue] = useState('');

  return (
    <View style={styles.container}>
      <Button preset="invisible" onPress={() => setModalVisible(true)}>
        Open Modal
      </Button>
      <SortModal
        isModalVisible={isModalVisible}
        toggleModal={() => setModalVisible(!isModalVisible)}
        radioButtonValue={radioButtonValue}
        onValueChange={(newValue: string) => setRadioButtonValue(newValue)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

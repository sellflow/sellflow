import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { storiesOf } from '@storybook/react-native';

import { ModalBottomSheetMessage } from '../../../components';
import { Button, ModalBottomSheet } from '../../../core-ui';

export default function modalBottomSheetStory() {
  const ModalBottomSheetStory = () => {
    let [isModalVisible, setModalVisible] = useState(false);

    return (
      <View>
        <Button
          preset="invisible"
          onPress={() => setModalVisible(true)}
          uppercase
        >
          {t('Open Error Modal')}
        </Button>
        <ModalBottomSheet
          isModalVisible={isModalVisible}
          toggleModal={() => setModalVisible(!isModalVisible)}
          title={t('Error')}
          height={284}
        >
          <ModalBottomSheetMessage
            isError={true}
            message={t('Error')}
            onPressModalButton={() => setModalVisible(false)}
            buttonText={t('Try Again')}
          />
        </ModalBottomSheet>
        <Button
          preset="invisible"
          onPress={() => setModalVisible(true)}
          uppercase
        >
          {t('Open Success Modal')}
        </Button>
        <ModalBottomSheet
          isModalVisible={isModalVisible}
          toggleModal={() => setModalVisible(!isModalVisible)}
          title={t('Success')}
          height={284}
        >
          <ModalBottomSheetMessage
            isError={false}
            message={t('Success')}
            onPressModalButton={() => setModalVisible(false)}
            buttonText={t('Done')}
          />
        </ModalBottomSheet>
      </View>
    );
  };

  return storiesOf('Modal Bottom Sheet', module).add(
    'Modal Bottom Sheet',
    () => (
      <View style={styles.container}>
        <ModalBottomSheetStory />
      </View>
    ),
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import React, { useState } from 'react';
import { storiesOf } from '@storybook/react-native';
import { View, StyleSheet } from 'react-native';
import { Button } from 'exoflex';

import { ModalBottomSheet } from '../../../core-ui';
import { ModalBottomSheetMessage } from '../../../components';

export default function modalBottomSheetStory() {
  const ModalBottomSheetStory = () => {
    let [isModalVisible, setModalVisible] = useState<boolean>(false);

    return (
      <View>
        <Button preset="invisible" onPress={() => setModalVisible(true)}>
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
        <Button preset="invisible" onPress={() => setModalVisible(true)}>
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

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Portal, Modal } from 'exoflex';

import { COLORS } from '../../../constants/colors';
import { FONT_SIZE } from '../../../constants/fonts';

type Props = {
  deleteVisible: boolean;
  toggleModal: () => void;
  onPressCancel: () => void;
  onPressDelete: () => void;
};

export function DeleteAddressModal(props: Props) {
  let { deleteVisible, toggleModal, onPressCancel, onPressDelete } = props;

  return (
    <Portal>
      <Modal
        contentContainerStyle={styles.modal}
        visible={deleteVisible}
        onDismiss={toggleModal}
      >
        <View style={styles.modalTitleContainer}>
          <Text weight="medium" style={styles.modalTitle}>
            {t('Delete Address')}
          </Text>
        </View>
        <Text style={styles.message}>
          {t(
            'Are you sure you want to delete this address? This action cannot be undone',
          )}
        </Text>
        <View style={styles.modalOptionContainer}>
          <Text
            weight="medium"
            style={styles.modalCancel}
            onPress={onPressCancel}
          >
            {t('No, Cancel')}
          </Text>

          <Text
            weight="medium"
            style={styles.modalDelete}
            onPress={onPressDelete}
          >
            {t('Yes, Delete')}
          </Text>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: COLORS.white,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalTitleContainer: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
  },
  modalTitle: {
    paddingVertical: 16,
    fontSize: FONT_SIZE.large,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    marginVertical: 24,
    marginHorizontal: 24,
    lineHeight: 24,
  },
  modalOptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 38,
  },
  modalCancel: {
    color: COLORS.primaryColor,
    fontSize: FONT_SIZE.medium,
    textTransform: 'uppercase',
  },
  modalDelete: {
    color: COLORS.red,
    fontSize: FONT_SIZE.medium,
    textTransform: 'uppercase',
  },
});

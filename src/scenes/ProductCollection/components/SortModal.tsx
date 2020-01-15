import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RadioButton } from 'exoflex';

import { ModalBottomSheet } from '../../../core-ui';
import { FONT_FAMILY, FONT_SIZE } from '../../../constants/fonts';
import { COLORS } from '../../../constants/colors';

type Props = {
  isModalVisible: boolean;
  toggleModal: () => void;
  radioButtonValue: string;
  onValueChange: (newValue: string) => void;
};

export default function SortModal(props: Props) {
  let { isModalVisible, toggleModal, radioButtonValue, onValueChange } = props;

  let textStyle = (label: string) => [
    styles.radioButtonText,
    radioButtonValue === label
      ? styles.activeTextStyle
      : styles.inactiveTextStyle,
  ];

  return (
    <ModalBottomSheet
      isModalVisible={isModalVisible}
      toggleModal={toggleModal}
      title={t('Sort By')}
      height={240}
      width={360}
    >
      <View style={styles.content}>
        <RadioButton.Group
          value={radioButtonValue}
          onValueChange={onValueChange}
        >
          <RadioButton
            label={t('Popularity')}
            {...(!radioButtonValue && { checked: true })}
            style={styles.radioButton}
            textStyle={textStyle(t('Popularity'))}
          />
          <RadioButton
            label={t('Price from High to Low')}
            style={styles.radioButton}
            textStyle={textStyle(t('Price from High to Low'))}
          />
          <RadioButton
            label={t('Price from Low to High')}
            style={styles.radioButton}
            textStyle={textStyle(t('Price from Low to High'))}
          />
        </RadioButton.Group>
      </View>
    </ModalBottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingBottom: 16,
  },
  radioButton: {
    paddingVertical: 17,
    paddingLeft: 27,
  },
  radioButtonText: {
    marginLeft: 15,
    fontSize: FONT_SIZE.medium,
  },
  activeTextStyle: {
    fontFamily: FONT_FAMILY.MEDIUM,
    color: COLORS.primaryColor,
  },
  inactiveTextStyle: {
    fontFamily: FONT_FAMILY.REGULAR,
    color: COLORS.black,
    opacity: 0.6,
  },
});

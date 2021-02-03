import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'exoflex';

import { ModalBottomSheet } from '../../../core-ui';
import { FONT_FAMILY, FONT_SIZE } from '../../../constants/fonts';
import { COLORS } from '../../../constants/colors';

import PriceSlider, {
  PriceSliderProps,
  PriceSliderRefObject,
} from './PriceSlider';

type Props = Omit<PriceSliderProps, 'submitButtonText'> & {
  isModalVisible: boolean;
  toggleModal: () => void;
  onClear: () => void;
};

export default function FilterModal(props: Props) {
  let {
    isModalVisible,
    toggleModal,
    onSubmit,
    minPrice,
    maxPrice,
    initialSliderValues,
    onClear,
    sliderStep,
  } = props;

  let priceSliderRef = useRef<PriceSliderRefObject>(null);
  let onClearPress = () => {
    onClear();
    priceSliderRef.current && priceSliderRef.current.clear();
  };

  return (
    <ModalBottomSheet
      isModalVisible={isModalVisible}
      toggleModal={toggleModal}
      title={t('Price')}
      height={284}
      width={360}
      headerRight={
        <TouchableOpacity onPress={onClearPress}>
          <Text style={styles.clearButton}>{t('Clear')}</Text>
        </TouchableOpacity>
      }
    >
      <View style={styles.content}>
        <PriceSlider
          sliderStep={sliderStep}
          ref={priceSliderRef}
          minPrice={minPrice}
          maxPrice={maxPrice}
          initialSliderValues={initialSliderValues}
          onSubmit={onSubmit}
          submitButtonText={t('Set Filter')}
        />
      </View>
    </ModalBottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 28,
    marginHorizontal: 24,
  },
  clearButton: {
    fontFamily: FONT_FAMILY.MEDIUM,
    color: COLORS.primaryColor,
    fontSize: FONT_SIZE.medium,
  },
});

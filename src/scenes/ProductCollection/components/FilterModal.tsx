import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Slider, TextInput, Button } from 'exoflex';

import { ModalBottomSheet } from '../../../core-ui';
import { FONT_FAMILY, FONT_SIZE } from '../../../constants/fonts';
import { COLORS } from '../../../constants/colors';
import formatNumber from '../../../helpers/formatNumber';
import parseNumber from '../../../helpers/parseNumber';

type Props = {
  isModalVisible: boolean;
  toggleModal: () => void;
  minPrice: number;
  maxPrice: number;
  sliderValues: Array<number>;
  sliderStep?: number;
  onSetFilter: (values: Array<number>) => void;
};

export default function FilterModal(props: Props) {
  let {
    isModalVisible,
    toggleModal,
    onSetFilter,
    minPrice,
    maxPrice,
    sliderValues,
    sliderStep = 1,
  } = props;
  let [priceRange, setPriceRange] = useState(sliderValues);
  let [sliderLength, setSliderLength] = useState(280); // default slider length

  let checkMinValue = (value: number) => {
    if (value === 0) {
      return 0;
    }
    if (value < minPrice) {
      return minPrice;
    }
    if (value >= priceRange[1]) {
      return priceRange[1] - sliderStep;
    }
    return value;
  };

  let checkMaxValue = (value: number) => {
    if (value === 0) {
      return 0;
    }
    if (value > maxPrice) {
      return maxPrice;
    }
    if (value <= priceRange[0]) {
      return priceRange[0] + sliderStep;
    }
    return value;
  };

  return (
    <ModalBottomSheet
      isModalVisible={isModalVisible}
      toggleModal={toggleModal}
      title={t('Price')}
      height={284}
      width={360}
      headerRight={
        <TouchableOpacity onPress={() => setPriceRange([minPrice, maxPrice])}>
          <Text style={styles.clearButton}>{t('Clear')}</Text>
        </TouchableOpacity>
      }
    >
      <View
        style={styles.content}
        onLayout={({
          nativeEvent: {
            layout: { width },
          },
        }) => {
          setSliderLength(width);
        }}
      >
        <Slider
          sliderLength={sliderLength}
          values={priceRange}
          showLabel={false}
          min={minPrice}
          max={maxPrice}
          step={sliderStep}
          onValuesChangeFinish={setPriceRange}
          containerStyle={styles.sliderContainer}
        />
        <View style={styles.textInputContainer}>
          <TextInput
            mode="outlined"
            label={t('Min. Price')}
            keyboardType="number-pad"
            containerStyle={[styles.textInput, styles.margin]}
            value={formatNumber(priceRange[0])}
            onChangeText={(text: string) => {
              setPriceRange([checkMinValue(parseNumber(text)), priceRange[1]]);
            }}
          />
          <TextInput
            mode="outlined"
            label={t('Max. Price')}
            containerStyle={styles.textInput}
            keyboardType="number-pad"
            value={formatNumber(priceRange[1])}
            onChangeText={(text: string) => {
              setPriceRange([priceRange[0], checkMaxValue(parseNumber(text))]);
            }}
          />
        </View>
        <Button
          onPress={() => {
            onSetFilter(priceRange);
            toggleModal();
          }}
        >
          {t('Set Filter')}
        </Button>
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
  sliderContainer: {
    alignItems: 'center',
    flex: 1,
    marginVertical: 8,
  },
  textInputContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  textInput: {
    flex: 1,
    height: 60,
  },
  margin: {
    marginRight: 16,
  },
});

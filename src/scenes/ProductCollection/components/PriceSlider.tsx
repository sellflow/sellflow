import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Slider, TextInput, Button } from 'exoflex';

import formatNumber from '../../../helpers/formatNumber';
import parseNumber from '../../../helpers/parseNumber';

type Props = {
  minPrice: number;
  maxPrice: number;
  initialSliderValues: Array<number>;
  sliderStep?: number;
  onSubmit: (values: Array<number>) => void;
  submitButtonText: string;
};

export default function PriceSlider(props: Props) {
  let {
    minPrice,
    maxPrice,
    initialSliderValues,
    sliderStep = 1,
    onSubmit,
    submitButtonText,
  } = props;
  let [sliderLength, setSliderLength] = useState(280); // default slider length
  let [priceRange, setPriceRange] = useState(initialSliderValues);

  let clampMinValue = (value: number) => {
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

  let clampMaxValue = (value: number) => {
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
    <View
      style={{ flex: 1 }}
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
            setPriceRange([clampMinValue(parseNumber(text)), priceRange[1]]);
          }}
        />
        <TextInput
          mode="outlined"
          label={t('Max. Price')}
          containerStyle={styles.textInput}
          keyboardType="number-pad"
          value={formatNumber(priceRange[1])}
          onChangeText={(text: string) => {
            setPriceRange([priceRange[0], clampMaxValue(parseNumber(text))]);
          }}
        />
      </View>
      <Button onPress={() => onSubmit(priceRange)}>{submitButtonText}</Button>
    </View>
  );
}

const styles = StyleSheet.create({
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

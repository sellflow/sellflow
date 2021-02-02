import React, { useState, useImperativeHandle, forwardRef, Ref } from 'react';
import { View, StyleSheet } from 'react-native';
import { Slider, TextInput, Button } from 'exoflex';

import formatNumber from '../../../helpers/formatNumber';
import parseNumber from '../../../helpers/parseNumber';
import { defaultButton, defaultButtonLabel } from '../../../constants/theme';

export type PriceSliderProps = {
  minPrice: number;
  maxPrice: number;
  initialSliderValues: [number, number];
  sliderStep?: number;
  submitButtonText: string;
  onSubmit: (values: [number, number]) => void;
  onValuesChangeStart?: () => void;
  onValuesChangeFinish?: () => void;
};

export type PriceSliderRefObject = {
  clear: () => void;
};

function PriceSlider(props: PriceSliderProps, ref: Ref<PriceSliderRefObject>) {
  let {
    minPrice,
    maxPrice,
    initialSliderValues,
    sliderStep = 1,
    onSubmit,
    submitButtonText,
    onValuesChangeStart = () => {},
    onValuesChangeFinish = () => {},
  } = props;

  let [sliderLength, setSliderLength] = useState<number>(280); // default slider length
  let [priceRange, setPriceRange] = useState<[number, number]>(
    initialSliderValues,
  );

  useImperativeHandle(ref, () => ({
    clear: () => {
      setPriceRange([minPrice, maxPrice]);
    },
  }));

  let clampMinValue = (value: number) => {
    if (value === 0) {
      return 0;
    }
    if (value < minPrice) {
      return minPrice;
    }
    if (value >= priceRange[1]) {
      if (priceRange[1] <= sliderStep) {
        return 0;
      }
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
        values={[
          priceRange[0],
          priceRange[1] < priceRange[0] ? priceRange[0] + 1 : priceRange[1],
        ]}
        showLabel={false}
        min={minPrice}
        max={maxPrice}
        step={sliderStep}
        onValuesChangeStart={onValuesChangeStart}
        onValuesChangeFinish={(values: [number, number]) => {
          setPriceRange(values);
          onValuesChangeFinish();
        }}
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
          onBlur={() => {
            if (priceRange[1] === 0) {
              setPriceRange([priceRange[0], maxPrice]);
            }
          }}
        />
      </View>
      <Button
        style={defaultButton}
        labelStyle={defaultButtonLabel}
        onPress={() => onSubmit(priceRange)}
        disabled={!(priceRange[1] >= priceRange[0])}
      >
        {submitButtonText}
      </Button>
    </View>
  );
}

export default forwardRef(PriceSlider);

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

import React, { forwardRef, Ref, useImperativeHandle, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MultiSlider from 'react-native-multi-slider';

import { defaultButton, defaultButtonLabel } from '../../../constants/theme';
import { Button, TextInput } from '../../../core-ui';
import { ScreenSize, useDimensions } from '../../../helpers/dimensions';
import formatNumber from '../../../helpers/formatNumber';
import parseNumber from '../../../helpers/parseNumber';

export type PriceSliderProps = {
  minPrice: number;
  maxPrice: number;
  // initialSliderValues: [number, number];
  initialSliderValues: Array<number>;
  sliderStep?: number;
  submitButtonText: string;
  onSubmit: (values: Array<number>) => void;
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

  let [sliderLength, setSliderLength] = useState(280); // default slider length
  let [priceRange, setPriceRange] = useState<Array<number>>(
    initialSliderValues,
  );
  let { screenSize } = useDimensions();

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
      <MultiSlider
        sliderLength={sliderLength}
        values={[
          priceRange[0],
          priceRange[1] < priceRange[0] ? priceRange[0] + 1 : priceRange[1],
        ]}
        min={minPrice}
        max={maxPrice}
        step={sliderStep}
        onValuesChangeStart={onValuesChangeStart}
        onValuesChangeFinish={(values: Array<number>) => {
          setPriceRange(values);
          onValuesChangeFinish();
        }}
        containerStyle={{
          ...styles.sliderContainer,
          marginVertical: screenSize === ScreenSize.Small ? 8 : 24,
        }}
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

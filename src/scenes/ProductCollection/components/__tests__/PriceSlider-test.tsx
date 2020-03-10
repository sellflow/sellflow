import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import { PriceSlider } from '../../components';

it('should render normally', () => {
  let { getByDisplayValue } = render(
    <PriceSlider
      minPrice={0}
      maxPrice={1000}
      initialSliderValues={[0, 1000]}
      onSubmit={() => {}}
      submitButtonText={t('Set Filter')}
    />,
  );
  let minPrice = getByDisplayValue('0');
  let maxPrice = getByDisplayValue('1,000');

  expect(minPrice).toBeTruthy();
  expect(maxPrice).toBeTruthy();

  fireEvent.changeText(minPrice, '10');
  minPrice = getByDisplayValue('10');
  expect(minPrice).toBeTruthy();

  fireEvent.changeText(maxPrice, '90');
  maxPrice = getByDisplayValue('90');
  expect(maxPrice).toBeTruthy();
});

it('should never go below minimum price', () => {
  let { getByDisplayValue } = render(
    <PriceSlider
      minPrice={10}
      maxPrice={1000}
      initialSliderValues={[10, 1000]}
      onSubmit={() => {}}
      submitButtonText={t('Set Filter')}
    />,
  );
  let minPrice = getByDisplayValue('10');
  expect(minPrice).toBeTruthy();

  fireEvent.changeText(minPrice, '9');
  minPrice = getByDisplayValue('10');
  expect(minPrice).toBeTruthy();
});

it('should never go above maximum price', () => {
  let { getByDisplayValue } = render(
    <PriceSlider
      minPrice={10}
      maxPrice={1000}
      initialSliderValues={[10, 1000]}
      onSubmit={() => {}}
      submitButtonText={t('Set Filter')}
    />,
  );
  let maxPrice = getByDisplayValue('1,000');
  expect(maxPrice).toBeTruthy();

  fireEvent.changeText(maxPrice, '1,001');
  maxPrice = getByDisplayValue('1,000');
  expect(maxPrice).toBeTruthy();
});

it('should not let minimum price be higher than maximum price', () => {
  let { getByDisplayValue } = render(
    <PriceSlider
      minPrice={10}
      maxPrice={1000}
      initialSliderValues={[10, 1000]}
      onSubmit={() => {}}
      submitButtonText={t('Set Filter')}
    />,
  );
  let minPrice = getByDisplayValue('10');
  expect(minPrice).toBeTruthy();

  fireEvent.changeText(minPrice, '1,001');
  minPrice = getByDisplayValue('999');
  expect(minPrice).toBeTruthy();
});

it('should not allow maximum price be lower than minimum price', () => {
  let { getByDisplayValue, getByProps } = render(
    <PriceSlider
      minPrice={10}
      maxPrice={1000}
      initialSliderValues={[10, 1000]}
      onSubmit={() => {}}
      submitButtonText={t('Set Filter')}
    />,
  );
  let maxPrice = getByDisplayValue('1,000');
  expect(maxPrice).toBeTruthy();

  fireEvent.changeText(maxPrice, '9');
  let submitButton = getByProps({ disabled: true });
  expect(submitButton).toBeTruthy();
});

it('should let 0 for minimum and maximum price', () => {
  let { getByDisplayValue, getAllByDisplayValue } = render(
    <PriceSlider
      minPrice={10}
      maxPrice={1000}
      initialSliderValues={[10, 1000]}
      onSubmit={() => {}}
      submitButtonText={t('Set Filter')}
    />,
  );
  let minPrice = getByDisplayValue('10');
  let maxPrice = getByDisplayValue('1,000');
  expect(minPrice).toBeTruthy();
  expect(maxPrice).toBeTruthy();

  fireEvent.changeText(minPrice, '0');
  fireEvent.changeText(maxPrice, '0');
  let count = getAllByDisplayValue('0').length;
  expect(count).toEqual(2);
});

it('should not let minimum price be equal to maximum price except for 0', () => {
  let { getByDisplayValue } = render(
    <PriceSlider
      minPrice={10}
      maxPrice={1000}
      initialSliderValues={[10, 1000]}
      onSubmit={() => {}}
      submitButtonText={t('Set Filter')}
    />,
  );
  let minPrice = getByDisplayValue('10');
  expect(minPrice).toBeTruthy();

  fireEvent.changeText(minPrice, '1,000');
  minPrice = getByDisplayValue('999');
  expect(minPrice).toBeTruthy();
});

import React, { useState } from 'react';
import { act, fireEvent, render } from 'react-native-testing-library';

import { CheckoutAddress } from '../';
import { addressItemData } from '../../fixtures/AddressItemData';

/*
  Used to fix Error: Call retries were exceeded at second test. Not sure why tho.
  Ref: https://stackoverflow.com/questions/60817275/jest-call-retries-were-exceeded
*/
jest.useFakeTimers();

test('should render normally', () => {
  let { queryByProps, getByText } = render(
    <CheckoutAddress
      onEditPressed={() => {}}
      data={addressItemData[0]}
      isSelected={true}
      onSelect={() => {}}
    />,
  );
  expect(queryByProps({ checked: true })).toBeTruthy();
  expect(getByText('Edit')).toBeTruthy();
});

test('should checked the address', () => {
  const App = () => {
    let [isSelected, setSelected] = useState(false);
    return (
      <CheckoutAddress
        onEditPressed={() => {}}
        data={addressItemData[0]}
        isSelected={isSelected}
        onSelect={() => setSelected(!isSelected)}
      />
    );
  };
  let { getByProps } = render(<App />);
  let checkoutAddress = getByProps({ checked: false });
  expect(checkoutAddress).toBeTruthy();

  act(() => fireEvent.press(checkoutAddress));
  expect(getByProps({ checked: true })).toBeTruthy();
});

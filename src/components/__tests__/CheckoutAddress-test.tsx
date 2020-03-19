import React, { useState } from 'react';
import { render, act, fireEvent } from 'react-native-testing-library';

import { CheckoutAddress } from '..';
import { addressItemData } from '../../fixtures/AddressItemData';

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
    let [isSelected, setSelected] = useState<boolean>(false);
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

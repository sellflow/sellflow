import React, { useState } from 'react';
import { render, act, fireEvent } from 'react-native-testing-library';

import { addressItemData } from '../../fixtures/AddressItemData';
import { ManageAddress } from '..';
import { AddressItem } from '../../types/types';
import { getFullName } from '../../helpers/getFullName';

test('should render normally', () => {
  let { getByText } = render(
    <ManageAddress
      data={addressItemData[0]}
      onPressSetPrimary={() => {}}
      onPressEdit={() => {}}
      onPressDelete={() => {}}
    />,
  );
  expect(
    getByText(
      getFullName(addressItemData[0].firstName, addressItemData[0].lastName),
    ),
  ).toBeTruthy();
  expect(getByText('Primary Address')).toBeTruthy();
});

test('should set the address as primary', () => {
  const App = () => {
    let [address, setAddress] = useState<AddressItem>(addressItemData[1]);
    return (
      <ManageAddress
        data={address}
        onPressSetPrimary={() => setAddress({ ...address, default: true })}
        onPressEdit={() => {}}
        onPressDelete={() => {}}
      />
    );
  };
  let { getByText } = render(<App />);
  let manageAddress = getByText('Set as Primary Address');
  expect(manageAddress).toBeTruthy();

  act(() => fireEvent.press(manageAddress));
  expect(getByText('Primary Address')).toBeTruthy();
});

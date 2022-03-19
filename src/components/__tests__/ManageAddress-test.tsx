import React, { useState } from 'react';
import { act, fireEvent, render } from 'react-native-testing-library';

import { ManageAddress } from '../';
import { addressItemData } from '../../fixtures/AddressItemData';
import { getFullName } from '../../helpers/getFullName';
import { AddressItem } from '../../types/types';

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

import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import { OrderItem } from '..';
import { OrderItem as OrderItemType } from '../../types/types';

let initialData: OrderItemType = {
  variantID: '1162321131111',
  itemName: 'Basic T Shirt',
  imageURL:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/UNIQLO_logo.svg/1200px-UNIQLO_logo.svg.png',
  itemPrice: 79,
  priceAfterDiscount: 12.13,
  quantity: 2,
  variant: 'Size M Grey',
  cardType: 'checkout',
};

test('should render normally', () => {
  let { getByText, getByDisplayValue } = render(
    <OrderItem orderItem={initialData} />,
  );
  let textInput = getByDisplayValue('2');
  let discount = getByText('$24.26');
  let price = getByText('$158.00');
  expect(textInput).toBeTruthy();
  fireEvent.changeText(textInput, 3);
  let label = getByText('$36.39');
  expect(label).toBeTruthy();
  expect(price).toBeTruthy();
  expect(discount).toBeTruthy();
});

test('should multiply the value correctly', () => {
  let { getByText, getByDisplayValue, getAllByText } = render(
    <OrderItem orderItem={initialData} />,
  );

  let textInput = getByDisplayValue('2');
  fireEvent.changeText(textInput, 3);
  let discount = getByText('$36.39');
  let price = getByText('$237.00');
  expect(discount).toBeTruthy();
  expect(price).toBeTruthy();

  fireEvent.changeText(textInput, 4);
  discount = getByText('$48.52');
  price = getByText('$316.00');

  expect(discount).toBeTruthy();
  expect(price).toBeTruthy();

  fireEvent.changeText(textInput, 0);
  let labels = getAllByText('$0.00');
  discount = labels[0];
  price = labels[1];
  expect(discount).toBeTruthy();
  expect(price).toBeTruthy();
});

test('should never go above 999 the value and below zero', () => {
  let { getByDisplayValue } = render(<OrderItem orderItem={initialData} />);
  let textInput = getByDisplayValue('2');
  fireEvent.changeText(textInput, 1111);
  textInput = getByDisplayValue('999');
  expect(textInput).toBeTruthy();
  fireEvent.changeText(textInput, -100);
  textInput = getByDisplayValue('0');
  expect(textInput).toBeTruthy();
});

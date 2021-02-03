import valid from 'card-validator';

import formatCardNumber from '../formatCardNumber';

it('should return the right format', () => {
  let cardNumber = '434343';
  expect(formatCardNumber(cardNumber, valid.number(cardNumber).card)).toBe(
    '4343 43',
  );

  cardNumber = '3433 3333 3333 33';
  expect(formatCardNumber(cardNumber, valid.number(cardNumber).card)).toBe(
    '3433 333333 3333',
  );

  cardNumber = '7';
  expect(formatCardNumber(cardNumber, valid.number(cardNumber).card)).toBe('7');

  cardNumber = '3$$$';
  expect(formatCardNumber(cardNumber, valid.number(cardNumber).card)).toBe('3');

  cardNumber = '4343 4343 4343 4343 4343';
  expect(formatCardNumber(cardNumber, valid.number(cardNumber).card)).toBe(
    '4343 4343 4343 4343434',
  );
});

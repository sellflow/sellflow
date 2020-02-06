import formatExpiryDate from '../formatExpiryDate';

it('should return the right format', () => {
  let expiryDate = '1';
  expect(formatExpiryDate(expiryDate)).toBe('1');

  expiryDate = '2';
  expect(formatExpiryDate(expiryDate)).toBe('02');

  expiryDate = '022';
  expect(formatExpiryDate(expiryDate)).toBe('02/2');

  expiryDate = '0223';
  expect(formatExpiryDate(expiryDate)).toBe('02/23');

  expiryDate = '13';
  expect(formatExpiryDate(expiryDate)).toBe('01/3');

  expiryDate = '0$';
  expect(formatExpiryDate(expiryDate)).toBe('0');
});

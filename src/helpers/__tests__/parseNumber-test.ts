import { createParser } from '../parseNumber';

it('should parse correctly', () => {
  let parseNumber = createParser('en-US');
  expect(parseNumber('0')).toBe(0);
  expect(parseNumber('0.12')).toBe(0.12);
  expect(parseNumber('1,234.56')).toBe(1234.56);
});

it('should parse correctly with leading characters', () => {
  let parseNumber = createParser('en-US');
  expect(parseNumber('$1')).toBe(1);
  expect(parseNumber('$ 1')).toBe(1);
  expect(parseNumber('$1,234,567.8')).toBe(1234567.8);
});

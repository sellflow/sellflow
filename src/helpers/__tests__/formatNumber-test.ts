import { createFormatter } from '../formatNumber';

it('should format correctly for en-US', () => {
  let formatNumber = createFormatter('en-US');
  expect(formatNumber(0)).toBe('0');
  expect(formatNumber(0.1)).toBe('0');
  expect(formatNumber(0.9)).toBe('1');
  expect(formatNumber(0.1234, 2)).toBe('0.12');
  expect(formatNumber(0.1299, 2)).toBe('0.13');
  expect(formatNumber(1234.567, 2)).toBe('1,234.57');
  expect(formatNumber(1234567.89, 2)).toBe('1,234,567.89');
});

import { valueBetweenZeroToMax } from '../valueBetweenZeroToMax';

it('should return max number', () => {
  expect(valueBetweenZeroToMax(100, 40)).toBe(40);
});
it('should return 0', () => {
  expect(valueBetweenZeroToMax(-100, 40)).toBe(0);
});
it('should return number given', () => {
  expect(valueBetweenZeroToMax(12, 40)).toBe(12);
});
it('should return 0 if NaN', () => {
  expect(valueBetweenZeroToMax(NaN, 40)).toBe(0);
});

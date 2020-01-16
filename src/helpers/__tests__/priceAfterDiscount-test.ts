import { priceAfterDiscount } from '../priceAfterDiscount';
it('should return discounted value if discount under 100 && above 0', () => {
  expect(priceAfterDiscount(100, 40)).toBe(60);
});
it('should discount price with 100', () => {
  expect(priceAfterDiscount(100, 110)).toBe(0);
});

it('should should not return minus', () => {
  expect(priceAfterDiscount(100, -10)).toBe(100.0);
});

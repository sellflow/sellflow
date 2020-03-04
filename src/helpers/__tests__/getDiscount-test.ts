import { getDiscount } from '../getDiscount';

it('should get price and discount', () => {
  let { price, discount } = getDiscount(12, 10);
  expect(price).toBe(12);
  expect(Math.round(discount)).toBe(17);
});

it('should get price and discount correctly', () => {
  let { price, discount } = getDiscount(-0, 10);
  expect(price).toBe(10);
  expect(discount).toBe(0);
});

export function priceAfterDiscount(
  itemPrice: number,
  discountPercent: number,
): number {
  let discountDecimal = Math.min(Math.max(discountPercent, 0), 100) / 100;
  return itemPrice * (1 - discountDecimal);
}

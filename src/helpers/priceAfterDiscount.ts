export function priceAfterDiscount(itemPrice: number, discount: number) {
  let discountDecimal =
    (discount > 100 ? 100 : discount < 0 ? 0 : discount) / 100;
  return (itemPrice * (1 - discountDecimal)).toFixed(2);
}

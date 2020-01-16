import formatNumber from './formatNumber';

export default function formatCurrency(value: number) {
  // TODO: Figure out how we'll handle other currencies.
  return '$' + formatNumber(value, 2);
}

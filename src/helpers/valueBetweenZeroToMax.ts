export function valueBetweenZeroToMax(value: number, max: number) {
  if (isNaN(value) || value < 0) {
    return 0;
  } else if (value > max) {
    return max;
  }
  return value;
}

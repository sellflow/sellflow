export function cleanNumber(value: string) {
  return value.replace(/[^\d]/g, '');
}

export function limitLength(value: string, maxLength: number) {
  return value.slice(0, maxLength);
}

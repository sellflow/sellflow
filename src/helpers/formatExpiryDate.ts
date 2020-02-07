import { limitLength, cleanNumber } from './utilities';

export default function formatExpiryDate(expiryDate: string) {
  let cleaned = limitLength(cleanNumber(expiryDate), 4);

  if (cleaned.match(/^[2-9]$/)) {
    return `0${cleaned}`;
  }
  if (cleaned.match(/^1[^012]$/)) {
    return `01/${cleaned.slice(-1)}`;
  }
  if (cleaned.length > 2) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
  }
  return cleaned;
}

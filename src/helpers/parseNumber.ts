import { LOCALE } from './translate';
import { getSeparators } from './formatNumber';

// Wrap this in a function for testing.
export function createParser(locale: string = LOCALE) {
  let { decimalSep, thousandsSep } = getSeparators(locale);
  const parseNumber = (input: string) => {
    let trimmed = input.replace(/^\D+/, '');
    let value = trimmed
      .split(thousandsSep)
      .join('')
      .replace(decimalSep, '.');
    return Number(value);
  };
  return parseNumber;
}

export default createParser();

import { cleanNumber, limitLength } from '../utilities';

it('should return the right format', () => {
  let cleaned = cleanNumber('444333ss$');
  expect(cleaned).toBe('444333');
  expect(limitLength(cleaned, 4)).toBe('4443');
});

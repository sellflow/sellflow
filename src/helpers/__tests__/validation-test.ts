import { validateEmail, validatePassword } from '../validation';

it('password should be minimum 5 chars in length', () => {
  expect(validatePassword('')).toBe(false);
  expect(validatePassword('a')).toBe(false);
  expect(validatePassword('abcd')).toBe(false);
  expect(validatePassword('abcde')).toBe(true);
});
it('email should return false if wrong format', () => {
  let email = 'jhonny@---';
  expect(validateEmail(email)).toBe(false);
  email = 'jhonny@-.com';
  expect(validateEmail(email)).toBe(false);
  email = 'jhonny-.com@gmail.com';
  expect(validateEmail(email)).toBe(false);
});
it('email should return true if right format', () => {
  let email = 'jhonny@kodefox.com';
  expect(validateEmail(email)).toBe(true);
});

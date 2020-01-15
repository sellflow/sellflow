import { validateEmail, validatePassword } from '../validation';

it('password should return false if char less than 8', () => {
  let password = 'jkaAJD1';
  expect(validatePassword(password)).toBe(false);
});
it('password should return true if char more than or 8', () => {
  let password = 'PQdLSD12';
  expect(validatePassword(password)).toBe(true);
});
it('will return false when one or more condition not accepted', () => {
  let password = 'kaduwn7235';
  expect(validatePassword(password)).toBe(false);
  password = 'AKTIAUURN55';
  expect(validatePassword(password)).toBe(false);
  password = 'asdkuhIJs';
  expect(validatePassword(password)).toBe(false);
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

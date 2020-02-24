import { getFullName } from '../getFullName';

it('should get fullname correctly', () => {
  let fullName = getFullName('Kevin', 'Lie');
  expect(fullName).toBe('Kevin Lie');
});

it('should get fullname correctly', () => {
  let fullName = getFullName('Kevin', '');
  expect(fullName).toBe('Kevin');
});

it('should get fullname correctly', () => {
  let fullName = getFullName('', 'Lie');
  expect(fullName).toBe('Lie');
});

it('should return firstName only', () => {
  let fullName = getFullName('Kevin');
  expect(fullName).toBe('Kevin');
});

it('should return lastName only', () => {
  let fullName = getFullName(undefined, 'Lie');
  expect(fullName).toBe('Lie');
});

it('should return empty string', () => {
  let fullName = getFullName('');
  expect(fullName).toBe('');
});

it('should return empty string', () => {
  let fullName = getFullName();
  expect(fullName).toBe('');
});

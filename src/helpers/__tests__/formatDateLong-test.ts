import formatDateLong from '../formatDateLong';

it('should return the right format', () => {
  let date = new Date(2020, 0, 16, 13, 34, 37).toISOString();
  expect(formatDateLong(date)).toBe('January 16, 2020');
  date = new Date(2120, 1, 19, 13, 34, 37).toISOString();
  expect(formatDateLong(date)).toBe('February 19, 2120');
  date = '2120-15-19T06:34:37.650Z';
  expect(formatDateLong(date)).toBe('');
  date = '';
  expect(formatDateLong(date)).toBe('');
});

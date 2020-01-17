import formatDOB from '../formatDOB';

it('should return the right format', () => {
  let date = '2020-01-16T06:34:37.650Z';
  let DOB = formatDOB(date);
  expect(DOB).toBe('January 16, 2020');
  date = '2120-02-19T06:34:37.650Z';
  DOB = formatDOB(date);
  expect(DOB).toBe('February 19, 2120');
  date = '2120-15-19T06:34:37.650Z';
  DOB = formatDOB(date);
  expect(DOB).toBe('');
  date = '';
  DOB = formatDOB(date);
  expect(DOB).toBe('');
});

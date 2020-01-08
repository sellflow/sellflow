import formatDateTime from '../formatDateTime';

it("should format datetime to 'dd/mm/yy hh:mm' format ", () => {
  let date1 = new Date('2019-12-17T17:24:00').toString();
  expect(formatDateTime(date1)).toBe('17/12/2019 17:24');

  let date2 = new Date('2019-01-01T09:05:00').toString();
  expect(formatDateTime(date2)).toBe('01/01/2019 09:05');
});

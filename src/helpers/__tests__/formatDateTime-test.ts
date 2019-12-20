import formatDateTime from '../formatDateTime';

it("should format datetime to 'dd/mm/yy hh:mm' format ", () => {
  let newDate = new Date('2019-12-17T17:24:00').toString();
  expect(formatDateTime(newDate)).toBe('17/12/2019 17:24');
});

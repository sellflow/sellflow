import formatDateTime from '../formatDateTime';

it("should format to 'm/d/yyyy h:mm PM' for en-US", () => {
  let locale = 'en-US';
  let date1 = new Date(2019, 0, 7, 17, 24).toISOString();
  expect(formatDateTime(date1, locale)).toBe('1/7/2019 5:24 PM');

  let date2 = new Date(2019, 11, 12, 9, 5).toISOString();
  expect(formatDateTime(date2, locale)).toBe('12/12/2019 9:05 AM');
});

// Node doesn't reliably support other locales
// it("should format to 'dd/mm/yyyy hh:mm' for en-GB", () => {
//   let locale = 'en-GB';
//   let date1 = new Date(2019, 0, 7, 17, 24).toISOString();
//   expect(formatDateTime(date1, locale)).toBe('07/01/2019 17:24');

//   let date2 = new Date(2019, 11, 12, 9, 5).toISOString();
//   expect(formatDateTime(date2, locale)).toBe('12/12/2019 09:05');
// });

import { LOCALE } from './translate';

export default function formatDateTime(input: string, locale: string = LOCALE) {
  let date = new Date(input);
  let datePart = date.toLocaleDateString(locale);
  let [time, amPm] = date.toLocaleTimeString(locale).split(' ');
  let timeParts = time.split(':');
  // Remove seconds if present.
  if (timeParts.length === 3) {
    timeParts.pop();
    time = timeParts.join(':');
  }
  let result = datePart + ' ' + time;
  if (amPm) {
    result += ' ' + amPm;
  }
  return result;
}

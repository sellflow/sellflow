import * as Localization from 'expo-localization';

// Use this for testing on a device.
const OVERRIDE_LOCALE = null;

const locale = OVERRIDE_LOCALE || Localization.locale;

export function is24Hour() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let [time, ampm] = new Date().toLocaleTimeString(locale).split(' ');
  return !ampm;
}

import * as Localization from 'expo-localization';

type ParamsObject = {
  [key: string]: unknown;
};

export const LOCALE = Localization.locale;

// This matches words inside curly braces.
const PLACEHOLDER = /\{(\w+)\}/g;

export function t(input: string, params?: ParamsObject): string {
  if (params) {
    return input.replace(PLACEHOLDER, (match: string, word: string) => {
      return params[word] != null ? String(params[word]) : match;
    });
  } else {
    return input;
  }
}

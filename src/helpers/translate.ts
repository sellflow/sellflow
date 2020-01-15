type ParamsObject = {
  [key: string]: unknown;
};

// TODO: In future get this from the device.
export const LOCALE = 'en-US';

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

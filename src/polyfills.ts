import { t } from './helpers/translate';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
((global: any) => {
  global.t = t;
})(typeof window === 'undefined' ? global : window);

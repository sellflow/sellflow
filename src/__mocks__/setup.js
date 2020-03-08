jest.mock('expo-localization', () => ({
  locale: 'en-US',
}));

require('../polyfills');
require('isomorphic-fetch');

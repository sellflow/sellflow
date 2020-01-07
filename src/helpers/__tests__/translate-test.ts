it('should translate', () => {
  expect(t('Hello')).toBe('Hello');
});

it('should translate with string interpolation', () => {
  expect(t('Hello {name}', { name: 'World' })).toBe('Hello World');
  expect(t('Hello {name}', { name: 123 })).toBe('Hello 123');
  expect(t('Hello {name}', { name: true })).toBe('Hello true');
});

it('should not substitute empty values', () => {
  expect(t('Hello {name}', { name: null })).toBe('Hello {name}');
  expect(t('Hello {name}', { name: undefined })).toBe('Hello {name}');
  expect(t('Hello {name}', {})).toBe('Hello {name}');
});

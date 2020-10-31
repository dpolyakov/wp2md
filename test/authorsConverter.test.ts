import { getAuthors } from '../src/authorsConverter';

const input = {
  'wp:author_id': 1,
  'wp:author_login': 'dima',
  'wp:author_email': 'github@dimapolyakov.ru',
  'wp:author_display_name': 'Dmitry',
  'wp:author_first_name': '',
  'wp:author_last_name': '',
};

const output = {
  '1': {
    id: 1,
    login: 'dima',
    displayName: 'Dmitry',
    email: 'github@dimapolyakov.ru',
    emailMd5: 'c01c5341f5656718b918ee695f6db3af',
  },
};
describe('authorsConverter', () => {
  it('should convert `IWpAuthor` to `IStaticAuthorsData`', () => {
    expect(getAuthors(input)).toEqual(output);
  });
});

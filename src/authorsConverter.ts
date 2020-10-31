import { getEncryptedEmail, castArray } from './utils';

import { IWpAuthor, IStaticAuthor, IStaticAuthorsData } from './types';

export const getAuthors = (
  wpAuthors: IWpAuthor | Array<IWpAuthor>
): IStaticAuthorsData => {
  const _wpAuthors = castArray(wpAuthors);

  return _wpAuthors.reduce((acc, wpAuthor) => {
    const staticAuthor = getStaticAuthor(wpAuthor);
    acc[staticAuthor.id] = staticAuthor;

    return acc;
  }, {} as IStaticAuthorsData);
};

const getStaticAuthor = (wpAuthor: IWpAuthor): IStaticAuthor => {
  return {
    id: wpAuthor['wp:author_id'],
    login: wpAuthor['wp:author_login'],
    displayName: wpAuthor['wp:author_display_name'],
    email: wpAuthor['wp:author_email'],
    emailMd5: getEncryptedEmail(wpAuthor['wp:author_email']),
  };
};

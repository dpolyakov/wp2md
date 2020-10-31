import { getEncryptedEmail, cleanContent } from './utils';
import { IWpComment, IStaticComment, IStaticAuthorsData } from './types';

const getStaticComment = ({
  wpComment,
  authors,
  publicOnly,
}: {
  wpComment: IWpComment;
  authors: IStaticAuthorsData;
  publicOnly: boolean;
}) => {
  const comment: IStaticComment = {
    id: String(wpComment['wp:comment_id']),
    parentId: String(wpComment['wp:comment_parent']),
    date: wpComment['wp:comment_date'],
    content: cleanContent(wpComment['wp:comment_content']),
    author: wpComment['wp:comment_author'],
    authorSite: wpComment['wp:comment_author_url'],
    approved: wpComment['wp:comment_approved'] === '1',
  };

  const commentUserId = wpComment['wp:comment_user_id'];
  const knownUser = authors[commentUserId];

  if (publicOnly) {
    if (knownUser) {
      comment.authorEmailMd5 = knownUser.emailMd5;
    } else {
      comment.authorEmailMd5 = getEncryptedEmail(
        wpComment['wp:comment_author_email']
      );
    }
  } else {
    comment.authorEmail = knownUser
      ? knownUser.email
      : wpComment['wp:comment_author_email'];
  }

  return comment;
};

export const getStaticComments = ({
  comments,
  authors,
  publicOnly = true,
}: {
  comments: Array<IWpComment>;
  authors: IStaticAuthorsData;
  publicOnly: boolean;
}): Array<IStaticComment> => {
  return comments.reduce((acc, wpComment: IWpComment) => {
    const comment: IStaticComment = getStaticComment({
      wpComment,
      authors,
      publicOnly,
    });

    if (comment.approved) {
      acc.push(comment);
    }

    return acc;
  }, [] as Array<IStaticComment>);
};

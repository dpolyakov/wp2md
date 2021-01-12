import yaml from 'js-yaml';
import TurndownService from 'turndown';

import { getStaticComments } from './commentConverter';
import { cleanContent } from './utils';

import { IWpEntry, IStaticAuthorsData, WpPostType } from './types';

const turndownService = new TurndownService();

turndownService.keep(['iframe', 'pre', 'code']);

type Taxonomies = { categories: string[]; tags: string[] };
type EntryMeta = {
  title: string;
  date: string;
  author: string;
  id: string;
  type: WpPostType;
  slug?: string;
  categories?: Array<string>;
  tags?: Array<string>;
  draft?: boolean;
};

export const converter = (entry: IWpEntry, authors: IStaticAuthorsData) => {
  const entryMeta: EntryMeta = {
    title: entry.title,
    date: entry['wp:post_date'],
    author: entry['dc:creator'],
    id: String(entry['wp:post_id']),
    type: entry['wp:post_type'],
  };

  if (entry['wp:status'] !== 'publish') {
    entryMeta.draft = true;
  }

  if (entry['wp:post_name'] !== '') {
    entryMeta.slug = entry['wp:post_name'];
  }

  if (entry.category && entry.category.length > 0) {
    const taxonomies = entry.category.reduce(
      (acc, taxonomy) => {
        switch (taxonomy.attr.domain) {
          case 'post_tag':
            acc.tags.push(taxonomy.value);
            break;

          case 'category':
            acc.categories.push(taxonomy.value);
            break;

          default:
            break;
        }

        return acc;
      },
      { categories: [], tags: [] } as Taxonomies
    );

    if (taxonomies.categories.length) {
      entryMeta.categories = taxonomies.categories;
    }

    if (taxonomies.tags.length) {
      entryMeta.tags = taxonomies.tags;
    }
  }

  let content = '---\n';
  content += yaml.dump(entryMeta);
  content += '---\n\n';

  content += turndownService.turndown(cleanContent(entry['content:encoded']));

  const fileName =
    entry['wp:post_name'] !== '' ? entry['wp:post_name'] : entry['wp:post_id'];

  const comments =
    entry['wp:comment'] && entry['wp:comment'].length
      ? getStaticComments({
          comments: entry['wp:comment'],
          authors,
          publicOnly: true,
        })
      : null;

  return {
    contentType: entry['wp:post_type'],
    contentId: entry['wp:post_id'],
    content,
    comments,
    fileName,
  };
};

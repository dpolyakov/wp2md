import json2md from 'json2md';
import TurndownService from 'turndown';

import { getYouTubeId, getVimeoId } from './utils';

import { IWpEntry } from './types';

const turndownService = new TurndownService();

turndownService.addRule('iframe', {
  filter: 'iframe',
  // @ts-ignore
  replacement: (content, node: HTMLIFrameElement) => {
    const youtubeId = getYouTubeId(node.src);

    if (youtubeId) {
      return `{{< youtube id="${youtubeId}" >}}`;
    } else {
      const vimeoId = getVimeoId(node.src);
      if (vimeoId) {
        return `{{< vimeo ${vimeoId} >}}`;
      }
    }

    return node.outerHTML;
  },
});

json2md.converters.separator = () => '---';
json2md.converters.meta = ({
  key,
  value,
}: {
  key: string;
  value?: string | null;
}) => {
  if (!value) {
    return `${key}:`;
  }
  return `${key}: "${value}"`;
};

type EntrySeparator = { separator: boolean };
type EntryMetaField = { meta: { key: string; value?: string } };
type EntryMetaValueList = { ul: string[] };
type EntryMeta = Array<EntrySeparator | EntryMetaField | EntryMetaValueList>;
type Taxonomies = { categories: string[]; tags: string[] };

export const converter = (entry: IWpEntry) => {
  const entryMeta: EntryMeta = [
    { separator: true },
    { meta: { key: 'title', value: entry.title } },
    { meta: { key: 'date', value: entry['wp:post_date'] } },
    { meta: { key: 'author', value: entry['dc:creator'] } },
    { meta: { key: 'id', value: String(entry['wp:post_id']) } },
    { meta: { key: 'type', value: entry['wp:post_type'] } },
    {
      meta: {
        key: 'draft',
        value: entry['wp:status'] === 'publish' ? 'false' : 'true',
      },
    },
  ];

  if (entry['wp:post_name'] !== '') {
    entryMeta.push({ meta: { key: 'slug', value: entry['wp:post_name'] } });
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
      entryMeta.push(
        { meta: { key: 'categories' } },
        { ul: taxonomies.categories }
      );
    }

    if (taxonomies.tags.length) {
      entryMeta.push({ meta: { key: 'tags' } }, { ul: taxonomies.tags });
    }
  }

  entryMeta.push({ separator: true });

  let content = json2md(entryMeta);

  content += turndownService.turndown(
    entry['content:encoded'].replace(/\n/g, '<br/>')
  );
  const fileName =
    entry['wp:post_name'] !== '' ? entry['wp:post_name'] : entry['wp:post_id'];

  return {
    fileName,
    content,
    contentType: entry['wp:post_type'],
  };
};

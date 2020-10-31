import { readFileSync } from 'fs';
import { join as pathJoin } from 'path';

import parser from 'fast-xml-parser';
import ProgressBar from 'progress';

import { writeToDisc } from './utils/';
import { converter } from './converter';
import { getAuthors } from './authorsConverter';

import { IWpEntry, IWpExport, IConfig, IStaticComment } from './types';

const config: IConfig = require('../config.js');

function convert(source: string, output: string) {
  const sourceFile = readFileSync(source, { encoding: 'utf8' });

  if (!sourceFile) {
    throw new Error('Error read xml');
  }

  const wpData: IWpExport = parser.parse(sourceFile, {
    attrNodeName: 'attr',
    attributeNamePrefix: '',
    textNodeName: 'value',
    ignoreAttributes: false,
  });

  const wpAuthors = wpData.rss.channel['wp:author'];
  const authors = getAuthors(wpAuthors);
  const content = wpData.rss.channel.item.filter((entry: IWpEntry) => {
    const status = entry['wp:status'];
    const type = entry['wp:post_type'];
    const checkStatus = status !== 'private' && status !== 'inherit';
    const checkType = type !== 'nav_menu_item';

    return checkStatus && checkType;
  });

  const total = content.length;
  const bar = new ProgressBar(':bar :percent :elapseds', {
    total,
    complete: '\u001b[44m \u001b[0m',
    width: 50,
  });

  content.forEach((entry: IWpEntry) => {
    const { fileName, content, contentType, contentId, comments } = converter(
      entry,
      authors
    );
    let contentPath = pathJoin(output, 'content', contentType);

    if (contentType === 'page') {
      contentPath = pathJoin(output, 'content');
    }

    writeToDisc(contentPath, `${fileName}.md`, content);

    if (comments) {
      writeCommentsData({ output, contentId, comments });
    }

    bar.tick();
  });
}

function writeCommentsData({
  output,
  contentId,
  comments,
}: {
  output: string;
  contentId: number;
  comments: Array<IStaticComment>;
}) {
  const contentPath = pathJoin(output, 'data', 'comments');

  writeToDisc(
    contentPath,
    `${contentId}.json`,
    JSON.stringify(comments, null, 2)
  );
}

convert(config.SOURCE, config.OUTRUT_DIR);

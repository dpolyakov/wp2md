import * as fs from 'fs';
import * as path from 'path';

import parser from 'fast-xml-parser';
import ProgressBar from 'progress';

import { checkOrCreateOutputFolder, catchErrors } from './utils/';
import { converter } from './converter';

import { IWpEntry } from './types';

const config = {
  SOURCE: './_source/index.xml',
  OUTRUT_DIR: './_result',
};

function convert(source: string, output: string) {
  const sourceFile = fs.readFileSync(source, { encoding: 'utf8' });

  if (!sourceFile) {
    throw new Error('Error read xml');
  }

  const wpData = parser.parse(sourceFile, {
    attrNodeName: 'attr',
    attributeNamePrefix: '',
    textNodeName: 'value',
    ignoreAttributes: false,
  });

  let content = wpData.rss.channel.item;

  content = content.filter((entry: IWpEntry) => {
    const status = entry['wp:status'];
    const type = entry['wp:post_type'];
    const checkStatus = status !== 'private' && status !== 'inherit';
    const checkType = type === 'post';

    return checkStatus && checkType;
  });

  const total = content.length;
  const bar = new ProgressBar(':bar', { total });

  content.forEach((entry: IWpEntry) => {
    const { fileName, content } = converter(entry);
    const filePath = path.join(output, `${fileName}.md`);

    checkOrCreateOutputFolder(output);
    fs.writeFile(filePath, content, {}, catchErrors);
    bar.tick();
  });
}

convert(config.SOURCE, config.OUTRUT_DIR);

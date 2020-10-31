import { existsSync, mkdirSync, writeFile } from 'fs';
import { join as pathJoin } from 'path';
import * as crypto from 'crypto';

export const checkOrCreateFolder = (folderName: string) => {
  try {
    if (!existsSync(folderName)) {
      mkdirSync(folderName, { recursive: true });
    }
  } catch (err) {
    throw err;
  }
};

export const catchErrors = (error: Error | null) => {
  if (error instanceof Error) {
    console.error(error);
    throw error;
  }
};

export const writeToDisc = (
  folder: string,
  fileName: string,
  content: string
) => {
  checkOrCreateFolder(folder);

  const filePath = pathJoin(folder, fileName);

  writeFile(filePath, content, {}, catchErrors);
};

export const getEncryptedEmail = (email: string): string => {
  return crypto
    .createHash('md5')
    .update(email)
    .digest('hex');
};

export const castArray = (...args: any): Array<any> => {
  if (!args.length) {
    return [];
  }

  const value = args[0];
  return Array.isArray(value) ? value : [value];
};

export const cleanContent = (content: string): string => {
  return content.replace(/\n/g, '<br/>');
};

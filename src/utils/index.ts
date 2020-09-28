import * as fs from 'fs';

export const checkOrCreateOutputFolder = (folderName: string) => {
  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
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

export const getYouTubeId = (url: string) => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);

  return match && match[7].length === 11 ? match[7] : null;
};

export const getVimeoId = (url: string) => {
  const regExp = /(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_-]+)?/;
  const match = url.match(regExp);

  return match && match[1].length > 5 ? match[1] : null;
};

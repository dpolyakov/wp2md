import { getYouTubeId } from '../../src/utils';

const goodUrls = [
  'http://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ&feature=related',
  'http://youtu.be/dQw4w9WgXcQ',
  'https://youtu.be/dQw4w9WgXcQ',
  'http://www.youtube.com/embed/dQw4w9WgXcQ',
  'http://www.youtube.com/watch?v=dQw4w9WgXcQ&amp;list=UUMvjDjBYT6_5fG-uGdgQnmg&amp;index=9&amp;feature=plcp',
];

const badUrls = [
  'http://youtube/112233',
  'http://youtube.com/foo',
  'https://youtube.com/channels/foo-barr/documentaryfilm/112233',
  'http://rutube.com',
];

describe('getYouTubeId should return', () => {
  badUrls.forEach((url: string) => {
    it(`false for bad url=${url}`, () => {
      const nullResult = getYouTubeId(url);

      expect(nullResult).toBe(null);
    });
  });

  goodUrls.forEach((url: string) => {
    it(`dQw4w9WgXcQ for youtube url=${url}`, () => {
      const result = getYouTubeId(url);

      expect(result).toBe('dQw4w9WgXcQ');
    });
  });
});

import { getVimeoId } from '../../src/utils';

const goodUrls = [
  'https://vimeo.com/32397612',
  'http://vimeo.com/32397612',
  'https://www.vimeo.com/32397612',
  'https://vimeo.com/channels/documentaryfilm/32397612',
  'https://vimeo.com/groups/musicvideo/videos/32397612',
  'https://vimeo.com/32397612?query=foo',
  'https://player.vimeo.com/video/32397612',
];

const badUrls = [
  'http://vimeo/112233',
  'http://vimeo.com/foo',
  'https://vimeo.com/channels/foo-barr/documentaryfilm/112233',
  'http://vimeo.com/groups/musicvideo/vid/112233',
  'https://vimeo.com.omomom/112233?query=foo',
];

describe('getVimeoId should return', () => {
  badUrls.forEach((url: string) => {
    it(`false for bad url=${url}`, () => {
      const nullResult = getVimeoId(url);

      expect(nullResult).toBe(null);
    });
  });

  goodUrls.forEach((url: string) => {
    it(`32397612 for youtube url=${url}`, () => {
      const result = getVimeoId(url);

      expect(result).toBe('32397612');
    });
  });
});

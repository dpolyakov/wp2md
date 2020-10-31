import { castArray } from '../../src/utils/';

describe('utils/castArray', () => {
  it('should return empty array if `args` is empty', () => {
    expect(castArray()).toEqual([]);
  });

  it('should return array of string if `args` is string', () => {
    expect(castArray('BANANA')).toEqual(['BANANA']);
  });

  it('should return array of object if `args` is object', () => {
    expect(castArray({ key: 'BANANA' })).toEqual([{ key: 'BANANA' }]);
  });

  it('should return equal array if `args` is array', () => {
    const arr = ['BANANA'];

    expect(castArray(arr)).toEqual(arr);
  });
});

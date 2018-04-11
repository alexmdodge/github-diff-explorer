import {
  getReversedPathFragments
} from './paths.js';

const testPath = {
  empty: '',
  regular: 'foo/bar/baz',
}

const expectedTestPathResult = {
  empty: '',
  regular: ['baz', 'bar', 'foo'],
}

test('Path is returned as reversed fragments', () => {
  var reversedFragments = getReversedPathFragments(testPath.regular);
  expect(reversedFragments).toEqual(expectedTestPathResult.regular);
});
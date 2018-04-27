import {
  getReversedPathFragments,
  matchFinalPathFragmentWithPattern,
  isUnifiedSplitSwitchPath,
  isValidHrefPath
} from './paths.js';


describe('Test - getReversedPathFragments', () => {
  const testPath = {
    empty: '',
    regular: 'foo/bar/baz',
  }
  
  const expectedTestPathResult = {
    empty: [''],
    regular: ['baz', 'bar', 'foo'],
  }

  test('Path is returned as reversed fragments', () => {
    var reversedFragments = getReversedPathFragments(testPath.regular);
    expect(reversedFragments).toEqual(expectedTestPathResult.regular);
  });
  
  test('Empty path is returned as single empty array', () => {
    var reversedFragments = getReversedPathFragments(testPath.empty);
    expect(reversedFragments).toEqual(expectedTestPathResult.empty);
  });
});

describe('Test - matchFinalPathFragmentWithPattern', () => {
  const testPath = 'foo/bar/my?baz&should&contain';
  const testMatch = 'baz';
  const testNoMatch = 'foo';

  test('Final fragment should match valid pattern', () => {
    var isMatched = matchFinalPathFragmentWithPattern(testPath, testMatch);
    expect(isMatched).toBeTruthy();
  });

  test('Final fragment should not match invalid pattern', () => {
    var isMatched = matchFinalPathFragmentWithPattern(testPath, testNoMatch);
    expect(isMatched).toBeFalsy();
  })
});

describe('Test - ')
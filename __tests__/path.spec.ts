import {
  getReversedPathFragments,
  matchFinalPathFragmentWithPattern,
  isUnifiedSplitSwitchPath,
  isValidHrefPath,
  checkIfValidAnchor,
  checkIfHashContainsAnchor
} from '../src/modules/paths'

declare let jsdom: any

describe('Path Module', () => {

  describe('Test - getReversedPathFragments', () => {
    const testPath = {
      empty: '',
      regular: 'foo/bar/baz'
    }
    
    const expectedTestPathResult = {
      empty: [''],
      regular: ['baz', 'bar', 'foo']
    }
    
    test('Path is returned as reversed fragments', () => {
      const reversedFragments = getReversedPathFragments(testPath.regular)
      expect(reversedFragments).toEqual(expectedTestPathResult.regular)
    })
    
    test('Empty path is returned as single empty array', () => {
      const reversedFragments = getReversedPathFragments(testPath.empty)
      expect(reversedFragments).toEqual(expectedTestPathResult.empty)
    })
    
    test('Null or falsy path returns a single empty array', () => {
      const reversedFragments = getReversedPathFragments(null as any)
      expect(reversedFragments).toEqual(expectedTestPathResult.empty)
    })
  })
  
  describe('Test - matchFinalPathFragmentWithPattern', () => {
    const testPath = 'foo/bar/my?baz&should&contain'
    const testMatch = /baz/
    const testNoMatch = /foo/
    
    test('Final fragment should match valid pattern', () => {
      const isMatched = matchFinalPathFragmentWithPattern(testPath, testMatch)
      expect(isMatched).toBeTruthy()
    })
    
    test('Final fragment should not match invalid pattern', () => {
      const isMatched = matchFinalPathFragmentWithPattern(testPath, testNoMatch)
      expect(isMatched).toBeFalsy()
    })
    
    test('Null params should not match', () => {
      const isMatched = matchFinalPathFragmentWithPattern(null as any, null as any)
      expect(isMatched).toBeFalsy()
    })
  })
  
  describe('Test - isUnifiedSplitSwitchPath', () => {
    const validPath = 'my/test/path/contains?diff=split'
    const invalidPath = 'my/test/path/does/not/contain'
    
    test('Path with diff view change should match', () => {
      const result = isUnifiedSplitSwitchPath(validPath)
      expect(result).toBeTruthy()
    })
    
    test('Path with no view change should not match', () => {
      const result = isUnifiedSplitSwitchPath(invalidPath)
      expect(result).toBeFalsy()
    })
    
    test('Falsy path should not match', () => {
      const result = isUnifiedSplitSwitchPath(null as any)
      expect(result).toBeFalsy()
    })
  })
  
  describe('Test - isValidHrefPath', () => {
    const validPath = 'my/test/path/contains/files?other=params'
    const validPathWithHash = 'my/test/path/contains/files/111e0dbac15bcefcf0a65552eb326aab64ab5d8a#diff-6cf900cead7a596e195beff2341aa608'
    const invalidPath = 'my/test/path/does/not/contain'
    
    test('Path with files fragment should match', () => {
      const result = isValidHrefPath(validPath)
      expect(result).toBeTruthy()
    })

    test('Path with files commit hash fragment should match', () => {
      const result = isValidHrefPath(validPathWithHash)
      expect(result).toBeTruthy()
    })
    
    test('Path without files fragment should not match', () => {
      const result = isValidHrefPath(invalidPath)
      expect(result).toBeFalsy()
    })
    
    test('Null path should not match', () => {
      const result = isValidHrefPath(null as any)
      expect(result).toBeFalsy()
    })
  })

  describe('Test - checkIfValidAnchor', () => {
    const validAnchorUrl = 'https://github.com/username/repo/pull/123/files#diff-2ccaee6c5cfa6c1e0a36166894df97bcL37'
    const invalidAnchorUrl = 'https://github.com/username/repo/pull/123/files#test'
    const noAnchorUrl = 'https://github.com/username/repo/pull/123/files'

    
    test('Anchor with valid data format should return true', () => {
      jsdom.reconfigure({
        url: validAnchorUrl
      })

      const result = checkIfValidAnchor()
      expect(result).toBeTruthy()
    })
    
    test('Any other anchor should fail', () => {
      jsdom.reconfigure({
        url: invalidAnchorUrl
      })

      const result = checkIfValidAnchor()
      expect(result).toBeFalsy()
    })
    
    test('Null anchors should fail', () => {
      jsdom.reconfigure({
        url: noAnchorUrl
      })

      const result = checkIfValidAnchor()
      expect(result).toBeFalsy()
    })
  })

  describe('Test - checkIfHashContainsAnchor', () => {
    const testAnchor = 'diff-2ccaee6c5cfa6c1e0a36166894df97bc'
    const validAnchorUrl = 'https://github.com/username/repo/pull/123/files#diff-2ccaee6c5cfa6c1e0a36166894df97bcL37'
    const invalidAnchorUrl = 'https://github.com/username/repo/pull/123/files#test'
    const noAnchorUrl = 'https://github.com/username/repo/pull/123/files'

    
    test('Anchor with valid data format should return true', () => {
      jsdom.reconfigure({
        url: validAnchorUrl
      })

      const result = checkIfHashContainsAnchor(testAnchor)
      expect(result).toBeTruthy()
    })
    
    test('Any other anchor should fail', () => {
      jsdom.reconfigure({
        url: invalidAnchorUrl
      })

      const result = checkIfHashContainsAnchor(testAnchor)
      expect(result).toBeFalsy()
    })
    
    test('Null anchors should fail', () => {
      jsdom.reconfigure({
        url: noAnchorUrl
      })

      const result = checkIfHashContainsAnchor(testAnchor)
      expect(result).toBeFalsy()
    })
  })
})
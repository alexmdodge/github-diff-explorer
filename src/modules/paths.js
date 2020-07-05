/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Functions for handling path parsing and validation
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * Tests the input path for meaningful strings which associate
 * with the 'Files Changed' tab.
 */
export function isValidHrefPath(path) {
  const fragmentPatterns = [
    /files/,
    /[a-z0-9]{40}/
  ]
  return matchFinalPathFragmentWithPattern(path, fragmentPatterns);
}

/**
 * Tests the input path to determine if the unified vs split diff
 * view has been requested.
 */
export function isUnifiedSplitSwitchPath(path) {
  return matchFinalPathFragmentWithPattern(path, /diff=/);
}

/**
 * Using a path determine the final fragment and test if it contains
 * any of the given patterns.
 */
export function matchFinalPathFragmentWithPattern(path, patterns) {
  if (!path || !patterns) {
    return false;
  }

  if (!Array.isArray(patterns)) {
    patterns = [patterns];
  }
  
  const pathFragments = path.split('/');
  const finalFragment = pathFragments[pathFragments.length - 1];
  const matchedPatterns = patterns.filter(pattern => pattern.test(finalFragment));

  return matchedPatterns.length > 0;
}

/**
 * Generate a reversed path fragment array from an input path string
 */
export function getReversedPathFragments(path) {
  if (!path) {
    return [''];
  }
  
  const fragments = path.split('/');
  fragments.reverse();

  return fragments;
}

/** 
 * Processes the current urls anchor hash and checks if it matches the
 * diff anchor data format.
 */
export function checkIfValidAnchor() {
  const anchorFormat = 'diff-';

  return checkIfHashContainsAnchor(anchorFormat);
}

/**
 * Accepts an anchor and compares it with the current hash to see if it
 * matches.
 * 
 * @export
 */
export function checkIfHashContainsAnchor(anchor) {
  const currentHash = window.location.hash;

  if (currentHash != null 
    && currentHash.indexOf(anchor) > -1) {
    return true;
  }

  return false;
}
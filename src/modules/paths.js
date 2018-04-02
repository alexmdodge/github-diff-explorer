/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Functions for handling path parsing and validation
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * Tests the input path for meaningful strings which associate
 * with the 'Files Changed' tab.
 */
export function isValidHrefPath(path) {
  return matchFinalPathFragmentWithPattern(path, 'files');
}

/**
 * Tests the input path to determine if the unified vs split diff
 * view has been requested.
 */
export function isUnifiedSplitSwitchPath(path) {
  return matchFinalPathFragmentWithPattern(path, 'diff=');
}

/**
 * Using a path determine the final fragment and test if it contains
 * the inputted pattern.
 */
export function matchFinalPathFragmentWithPattern(path, pattern) {
  const pathFragments = path.split('/');
  const finalFragment = pathFragments[pathFragments.length - 1];

  return finalFragment.indexOf(pattern) > -1;
}

/**
 * Generate a reversed path fragment array from an input path string
 */
export function getReversedPathFragments(path) {
  const fragments = path.split('/');
  fragments.reverse();

  return fragments;
}

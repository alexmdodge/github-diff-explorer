import { gh } from './constants';
import { getFileElements } from './structure';
import { isValidHrefPath, isUnifiedSplitSwitchPath } from './dom';
import debug from './debug';

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Functions for handling events and polling page state do determine when
 * it is appropriate to load and re-load the extension.
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * Uses the document ready state property to determine
 * when the page is ready to be manipulated. Returns a
 * resolved promise when this has occurred.
 */
export function onContentReady(fn) {
  const wrappedCallback = () => {
    debug.log('[onContentRead] Page content ready');
    fn();
  }

  // Only add a ready state listener if the content is
  // not already loaded
  if (document.readyState === "complete") {
    wrappedCallback();
  } else {
    document.onreadystatechange = () => {
      if (document.readyState === "complete") {
        wrappedCallback()
      }
    };
  }
}

/**
 * Poll the current page to determine when all of the file diffs
 * have loaded. The parsed file elements are returned in the callback.
 */
export function onFilesLoaded(fn) {
  const filesChangedEl = document.getElementById(gh.filesChangedId);

  if (!filesChangedEl) {
    debug.log('[onFilesLoaded] Cannot retrieve filesChangedEl');
    setTimeout(onFilesLoaded.bind(this, fn), 250);
    return;
  }

  const fileEls = getFileElements();
  const numFilesChanged = parseInt(filesChangedEl.innerText.trim(), 10);

  if (fileEls.length !== numFilesChanged) {
    debug.log('[onFilesLoaded] All files have not loaded yet');
    setTimeout(onFilesLoaded.bind(this, fn), 250);
    return;
  }

  debug.log('[onFilesLoaded] All files have loaded: ', fileEls);
  fn(fileEls);
}

/**
 * Poll the current href location to determine when the PR
 * single page app has switched to the 'Files Changed' tab.
 *
 * Note: The popstate events were not effective here as they
 * were firing intermittently.
 */
export function onLocationChanged(currentHref, fn) {
  const nextHref = window.location.href;
  const isSameLocation = nextHref === currentHref;

  if (!isSameLocation && isValidHrefPath(nextHref)) {
    debug.log('[onLocationChanged] Location changed to valid files path: ', nextHref);

    if (isUnifiedSplitSwitchPath(nextHref)) {
      debug.log('[onLocationChanged] Switch to diff view, deferring location change');

      setTimeout(() => {
        fn(nextHref);
      }, 1000);
    } else {
      fn(nextHref);
    }
  }

  setTimeout(onLocationChanged.bind(this, nextHref, fn), 500);
}
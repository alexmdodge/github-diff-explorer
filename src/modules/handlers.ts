import { gh, styleClass } from './constants'
import { getFileElements } from './structure'
import { isValidHrefPath, isUnifiedSplitSwitchPath } from './paths'
import logger from './debug'

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
    logger.log('[onContentReady] Page content ready')
    fn()
  }

  // Only add a ready state listener if the content is
  // not already loaded
  if (document.readyState === 'complete') {
    wrappedCallback()
  } else {
    document.onreadystatechange = () => {
      if (document.readyState === 'complete') {
        wrappedCallback()
      }
    }
  }
}

/**
 * Poll the current page to determine when all of the file diffs
 * have loaded. The parsed file elements are returned in the callback.
 */
export function onFilesLoaded(fn) {
  const filesChangedEl = document.getElementById(gh.filesChangedId)

  const fileExplorerContainerExists = !!document.querySelector(`.${styleClass.explorerContainer}`)
  if (fileExplorerContainerExists) {
    logger.log('[onFilesLoaded] File explorer is already built.')
    return
  }

  if (!filesChangedEl) {
    logger.log('[onFilesLoaded] Cannot retrieve filesChangedEl')
    setTimeout(onFilesLoaded.bind(this, fn), 250)
    return
  }

  // Some file els can be present on the page but hidden from view when
  // navigating from within the PR view.
  const readyFileEls = getFileElements().filter(el => {
    return el.clientHeight > 0 && el.clientWidth > 0
  })

  const numFilesChanged = parseInt(filesChangedEl.innerText.trim(), 10)

  if (readyFileEls.length !== numFilesChanged) {
    logger.debug('[onFilesLoaded] All files have not loaded yet')
    setTimeout(onFilesLoaded.bind(this, fn), 250)
    return
  }

  logger.log('[onFilesLoaded] All files have loaded: ', readyFileEls)
  fn(readyFileEls)
}

/**
 * Poll the current href location to determine when the PR
 * single page app has switched to the 'Files Changed' tab.
 *
 * Note: The popstate events were not effective here as they
 * were firing intermittently.
 */
export function onLocationCheck(currentHref, fn) {
  const nextHref = window.location.href
  const isSameLocation = nextHref === currentHref

  // Navigating to the same url can reset the DOM structure, need
  // to confirm the integrity of the explorer
  const fileExplorerContainerExists = !!document.querySelector(`.${styleClass.explorerContainer}`)

  const isNavigatingToFilesChanged = !isSameLocation && isValidHrefPath(nextHref)
  const isRefreshingFilesChanged = isSameLocation && isValidHrefPath(nextHref) &&!fileExplorerContainerExists

  if (isNavigatingToFilesChanged) {
    logger.log('[onLocationCheck] Location changed to valid files path: ', nextHref)
    fn(nextHref)
  } else if (isRefreshingFilesChanged) {
    logger.log('[onLocationCheck] Location is the same but the explorer was cleared from DOM re-render.')
    fn(nextHref)
  }

  // Because of the domain level we have to load the extension at, change the
  // timeout length according to how close the user is to the pull request page
  let timeout

  if (nextHref.indexOf('pull/') > -1) {
    // We're at the pull request level so check frequently
    logger.debug('[onLocationCheck] Monitoring location changes at the pull request level')

    timeout = 500
  } else if (nextHref.indexOf('pulls') > -1) {
    // On the pull request list page so check somewhat frequently
    logger.debug('[onLocationCheck] Monitoring location changes at the pull request list level')

    timeout = 1500
  } else {
    // We're at the pull repository level so check intermittently
    logger.debug('[onLocationCheck] Monitoring location changes at the repository level')

    timeout = 3000
  }

  setTimeout(onLocationCheck.bind(this, nextHref, fn), timeout)
}
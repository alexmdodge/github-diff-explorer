import { gh, styleClass } from './constants'
import { getFileElements } from './structure'
import { isValidHrefPath } from './paths'
import { Logger } from './logger'

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Functions for handling events and polling page state do determine when
 * it is appropriate to load and re-load the extension.
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * Uses the document ready state property to determine
 * when the page is ready to be manipulated. Returns a
 * resolved promise when this has occurred.
 */
export function onContentReady(): Promise<boolean> {
  return new Promise((resolve) => {
    const logAndResolve = () => {
      Logger.log('[onContentReady] Page content ready')
      resolve()
    }

    // Only add a ready state listener if the content is
    // not already loaded
    if (document.readyState === 'complete') {
      logAndResolve()
    } else {
      document.onreadystatechange = () => {
        if (document.readyState === 'complete') {
          logAndResolve()
        }
      }
    }
  })
}

/**
 * Poll the current page to determine when all of the file diffs
 * have loaded. The parsed file elements are returned in the promise.
 * If certain aspects are not yet available, or additional elements are
 * loading, a delayed promise poll will continue.
 */
export function onFilesLoaded(): Promise<HTMLElement[]> {
  const checkLoadedFilesAfter = (timeout = 0) => {
    return new Promise<HTMLElement[]>((resolve, reject) => {
      const DEFAULT_INTERNAL_POLL_RATE = 250

      setTimeout(() => {
        const filesChangedEl = document.getElementById(gh.filesChangedId)

        const fileExplorerContainerExists = !!document.querySelector(`.${styleClass.explorerContainer}`)
        if (fileExplorerContainerExists) {
          Logger.log('[onFilesLoaded] File explorer is already built.')
          reject('File explorer already exists')
          return
        }
    
        if (!filesChangedEl) {
          Logger.log('[onFilesLoaded] Cannot retrieve filesChangedEl')
          resolve(checkLoadedFilesAfter(DEFAULT_INTERNAL_POLL_RATE))
          return
        }

        // Some file els can be present on the page but hidden from view when
        // navigating from within the PR view.
        const readyFileEls = getFileElements().filter(el => {
          return el.clientHeight > 0 && el.clientWidth > 0
        })
    
        const numFilesChanged = parseInt(filesChangedEl.innerText.trim(), 10)
    
        if (readyFileEls.length !== numFilesChanged) {
          Logger.debug('[onFilesLoaded] All files have not loaded yet')
          resolve(checkLoadedFilesAfter(DEFAULT_INTERNAL_POLL_RATE))
          return
        }
    
        // TODO: Provide progressive loading of files elements as they become available
        // Probably something more suited for an observable
    
        Logger.log('[onFilesLoaded] All files have loaded: ', readyFileEls)
        resolve(readyFileEls)
      }, timeout)
    })
  }

  return checkLoadedFilesAfter()
}

/**
 * Poll the current href location to determine when the PR
 * single page app has switched to the 'Files Changed' tab.
 *
 * Note: The popstate events were not effective here as they
 * were firing intermittently.
 */
export function onLocationCheck(currentHref: string): Promise<string> {
  const checkLocationAfter = (timeout: number) => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        const nextHref = window.location.href
        const isSameLocation = nextHref === currentHref
      
        // Navigating to the same url can reset the DOM structure, need
        // to confirm the integrity of the explorer
        const fileExplorerContainerExists = !!document.querySelector(`.${styleClass.explorerContainer}`)
      
        const isNavigatingToFilesChanged = !isSameLocation && isValidHrefPath(nextHref)
        const isRefreshingFilesChanged = isSameLocation && isValidHrefPath(nextHref) && !fileExplorerContainerExists
      
        if (isNavigatingToFilesChanged) {
          Logger.log('[onLocationCheck] Location changed to valid files path: ', nextHref)
          resolve(nextHref)
        } else if (isRefreshingFilesChanged) {
          Logger.log('[onLocationCheck] Location is the same but the explorer was cleared from DOM re-render.')
          resolve(nextHref)
        }
      
        // Because of the domain level we have to load the extension at, change the
        // timeout length according to how close the user is to the pull request page
        let nextPollRate = 0
      
        if (nextHref.indexOf('pull/') > -1) {
          // We're at the pull request level so check frequently
          Logger.debug('[onLocationCheck] Monitoring location changes at the pull request level')
      
          nextPollRate = 500
        } else if (nextHref.indexOf('pulls') > -1) {
          // On the pull request list page so check somewhat frequently
          Logger.debug('[onLocationCheck] Monitoring location changes at the pull request list level')
      
          nextPollRate = 1500
        } else {
          // We're at the pull repository level so check intermittently
          Logger.debug('[onLocationCheck] Monitoring location changes at the repository level')
      
          nextPollRate = 3000
        }
      
        resolve(checkLocationAfter(nextPollRate))
      }, timeout)
    })
  }

  return checkLocationAfter(0)
}
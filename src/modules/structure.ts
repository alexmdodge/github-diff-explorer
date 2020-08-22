import { gh } from './constants'

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Functions for handling data parsing related to the structure of the
 * file explorer.
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export interface DecoratedElements {
  path: string,
  anchor: string,
  el: HTMLElement
}

/**
 * Loops through an array of elements and creates a convenience
 * object for accessing a dataset property.
 */
export function extractPathDataFromElements(elements: HTMLDivElement[]): DecoratedElements[] {
  return elements.map(el => {
    const child: HTMLElement = el.children[0] as HTMLElement

    return {
      path: child.dataset.path ?? '',
      anchor: child.dataset.anchor ?? '',
      el: el
    }
  })
}

/**
 * Traverses the container which holds each of the file diffs and
 * returns a consistent structure with all of the currently available files.
 */
export function getFileElements(): HTMLElement[] {
  const fileElContainers = getFileElementContainers()
  const splitFileEls = extractFileElementsFromContainers(fileElContainers)
  const mergedFileElements = mergeFileElements(splitFileEls)
  const fileEls = filterUnusedFileElements(mergedFileElements)

  return fileEls
}

function unwrapToIterable(nonIterable: HTMLCollection | NodeListOf<Element>): HTMLElement[] {
  const unwrapped: HTMLElement[] = []

  for (let i = 0; i < nonIterable.length; i++) {
    unwrapped[i] = nonIterable[i] as HTMLElement
  }

  return unwrapped
}

/**
 * Each set of file diffs is contained in a container element. There
 * can be multiple containers depending on how many file diffs there
 * are in the PR. Retrieve each of the containers and transform from
 * a node list to an array.
 */
export function getFileElementContainers(): HTMLElement[] {
  const elementContainers = document.querySelectorAll(`.${gh.fileWrapperClass}`)

  return unwrapToIterable(elementContainers)
}

/**
 * Maps through the containers and returns all of the child elements
 * of that container as an array.
 */
export function extractFileElementsFromContainers(containers: HTMLElement[]): HTMLElement[][] {
  return containers.map(container => unwrapToIterable(container.children))
}

/**
 * Takes an array of arrays and flattens it up to a depth of one.
 */
export function mergeFileElements(nestedFiles: HTMLElement[][]): HTMLElement[] {
  const baseArray: HTMLElement[] = []
  return baseArray.concat(...nestedFiles)
}

/**
 * Only return the elements that are actually the file diffs. Some
 * of the elements probably exist for metadata purposes.
 */
export function filterUnusedFileElements(elements: HTMLElement[]): HTMLElement[] {
  return elements.filter(el => el.classList.contains(gh.fileClass))
}

// TODO: Check the container list to determine what Git notification file structures
// are and where to pull them in
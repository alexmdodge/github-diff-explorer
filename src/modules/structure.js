import { gh } from './constants';

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Functions for handling data parsing related to the structure of the
 * file explorer.
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * Loops through an array of elements and creates a convenience
 * object for accessing a dataset property.
 */
export function extractPathDataFromElements(elements) {
  return elements.map(el => {
    return {
      path: el.children[0].dataset.path,
      anchor: el.children[0].dataset.anchor,
      viewedButton: el.children[0].getElementsByClassName('js-reviewed-checkbox')[0],
      viewed: el.children[0].getElementsByClassName('js-reviewed-checkbox')[0].getAttribute('data-ga-click').includes("true"),
      el: el,
    };
  });
}

/**
 * Traverses the container which holds each of the file diffs and
 * returns a consistent structure with all of the currently available files.
 */
export function getFileElements() {
  const fileElContainers = getFileElementContainers();
  const splitFileEls = extractFileElementsFromContainers(fileElContainers);
  const mergedFileElements = mergeFileElements(splitFileEls);
  const fileEls = filterUnusedElements(mergedFileElements);

  return fileEls;
}

/**
 * Each set of file diffs is contained in a container element. There
 * can be multiple containers depending on how many file diffs there
 * are in the PR. Retrieve each of the containers and transform from
 * a node list to an array.
 */
export function getFileElementContainers() {
  return [...document.querySelectorAll(`.${gh.fileWrapperClass}`)];
}

/**
 * Maps through the containers and returns all of the child elements
 * of that container as an array.
 */
export function extractFileElementsFromContainers(containers) {
  return containers.map(container => {
    return [...container.children];
  })
}

/**
 * Takes an array of arrays and flattens it up to a depth of one.
 */
export function mergeFileElements(nestedFiles) {
  return [].concat(...nestedFiles);
}

/**
 * Only return the elements that are actually the file diffs. Some
 * of the elements probably exist for metadata purposes.
 */
export function filterUnusedElements(elements) {
  return elements.filter(el => el.classList.contains(gh.fileClass));
}
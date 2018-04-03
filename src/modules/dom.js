import { gh, styleClass } from './constants';
import icons from './icons';

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Functions for handling DOM structure generation, data properties, and
 * class additions.
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * Generates a nested list DOM structure based on the nested object passed 
 * to the function.
 */
export function generateExplorerFolderElements(explorerData) {
  const currentFolderDataKeys = Object.keys(explorerData);
  const explorerFolderEl = getExplorerFolderElement();

  currentFolderDataKeys.forEach(folderKey => {
    const nestedFolderEl = getNestedFolderElement();
    const currentFileData = explorerData[folderKey];

    if (!!currentFileData.explorerItemEl) {
      // If the explorer item element exists then we've
      // reached the end of the branch.
      nestedFolderEl.appendChild(currentFileData.explorerItemEl);
    } else {
      // If not create a folder header and continue to nest elements
      const folderDescriptor = getFolderDescriptorElementWithName(folderKey);
      nestedFolderEl.appendChild(folderDescriptor);
      nestedFolderEl.appendChild(generateExplorerFolderElements(currentFileData));
    }

    explorerFolderEl.appendChild(nestedFolderEl);
  });

  return explorerFolderEl;
}

export function removeElementChildren(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }

  return el;
}

export function prepareEmptyDiffViewerElement() {
  const el = document.querySelector(`.${gh.explorerContainerClass}`);
  el.classList.add(styleClass.root);

  const emptyEl = removeElementChildren(el);
  return emptyEl;
}

export function setupPageStructure() {
  const issuesListContainer = document.querySelector(`.${gh.pageContainerClass}`);
  issuesListContainer.classList.add(styleClass.pageContainer);
}

export function addEachFileToContainer(els, container) {
  els.forEach(el => {
    el.classList.add(styleClass.fileDiff);
    container.appendChild(el);
  });
}

/* DOM Creation */

export function getExplorerFolderElement() {
  const el = document.createElement('ul');
  el.classList.add(styleClass.explorerFolderContainer);

  return el;
}

export function getNestedFolderElement() {
  const el = document.createElement('li');

  return el;
}

export function getFolderDescriptorElementWithName(name) {
  const el = document.createElement('span');
  el.classList.add(styleClass.explorerFolderHeader);
  el.innerHTML = `
    <span class="${styleClass.caretIcon}">
      ${icons.caretDown}
    </span>
    <span class="${styleClass.icon}">
      ${icons.folderOpen}
    </span>
    ${name}
  `;

  el.addEventListener('click', (event) => {
    const isClosed = el.classList.contains(styleClass.closedFolder);

    if (isClosed) {
      el.classList.remove(styleClass.closedFolder);
      el.innerHTML = `
        <span class="${styleClass.caretIcon}">
          ${icons.caretDown}
        </span>
        <span class="${styleClass.icon}">
          ${icons.folderOpen}
        </span>
        ${name}
      `;
    } else {
      el.classList.add(styleClass.closedFolder);
      el.innerHTML = `
        <span class="${styleClass.caretIcon}">
          ${icons.caretRight}
        </span>
        <span class="${styleClass.icon}">
          ${icons.folderClosed}
        </span>
        ${name}
      `;
    }
  });

  return el;
}

export function getExplorerContainerElement() {
  const el = document.createElement('div');
  el.classList.add(styleClass.explorerContainer);

  return el;
}

export function getExplorerHeaderElement() {
  const el = document.createElement('h5');
  el.classList.add(styleClass.explorerHeader);
  el.innerText = 'File Explorer';

  return el;
}

export function getFilesContainerElement() {
  const el = document.createElement('div');
  el.classList.add(gh.fileWrapperClass);
  el.classList.add(styleClass.fileDiffContainer);

  return el;
}

export function getExplorerItemElementWithName(name) {
  const el = document.createElement('span');
  el.classList.add(styleClass.explorerItem);
  el.innerHTML = `
    <span class="${styleClass.icon} ${styleClass.fileIcon}">
      ${icons.file}
    </span>
    <span>
      ${name}
    </span>
  `;

  return el;
}

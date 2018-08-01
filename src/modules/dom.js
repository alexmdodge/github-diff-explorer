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

export function getLoadingElement() {
  const el = document.createElement('div');
  el.classList.add(styleClass.loader);

  return el;
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

export function getExplorerHeaderElement(gdeContainer) {
  const el = document.createElement('div');
  el.classList.add(styleClass.explorerHeader);

  const headerTitleElement = getExplorerHeaderTitle();
  const headerMenuElement = getExplorerHeaderMenuElement(gdeContainer);

  el.appendChild(headerTitleElement);
  el.appendChild(headerMenuElement);

  return el;
}

function getExplorerHeaderTitle() {
  const container = document.createElement('span');
  const logo = document.createElement('img');
  const title = document.createElement('h5');

  container.classList.add(styleClass.explorerHeaderTitleContainer);

  title.classList.add(styleClass.explorerHeaderTitle);
  title.innerText = 'File Explorer';

  logo.classList.add(styleClass.explorerHeaderLogo);
  logo.src = icons.logo;

  container.appendChild(logo);
  container.appendChild(title);

  return container;
}

function getExplorerHeaderMenuElement(gdeContainer) {
  const el = document.createElement('div');
  el.classList.add(styleClass.explorerHeaderMenu);

  const minBtn = document.createElement('span');
  const maxBtn = document.createElement('span');
  minBtn.classList.add(styleClass.explorerMenuButton);
  minBtn.classList.add(styleClass.explorerActiveMenuButton);
  maxBtn.classList.add(styleClass.explorerMenuButton);

  minBtn.title = 'Minimize Explorer';
  maxBtn.title = 'Maximize Explorer';

  minBtn.innerHTML = icons.minus;
  maxBtn.innerHTML = icons.plus;

  minBtn.addEventListener('click', () => {
    minBtn.classList.remove(styleClass.explorerActiveMenuButton);
    maxBtn.classList.add(styleClass.explorerActiveMenuButton);

    gdeContainer.classList.add(styleClass.minimizedContainer);
  });

  maxBtn.addEventListener('click', () => {
    maxBtn.classList.remove(styleClass.explorerActiveMenuButton);
    minBtn.classList.add(styleClass.explorerActiveMenuButton);

    gdeContainer.classList.remove(styleClass.minimizedContainer);
  });

  el.appendChild(minBtn);
  el.appendChild(maxBtn);

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

import { gh } from './constants';

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Functions for handling DOM structure generation, data properties, and
 * class additions.
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * Generates a nested list DOM structure based on the nested object passed 
 * to the function.
 */
export function getChildNode(childData) {
  var files = Object.keys(childData);
  var filesContainer = document.createElement('ul');
  filesContainer.classList.add('gcfe__nested-files');

  files.forEach(file => {
    var fileItem = document.createElement('li');

    var currentFileData = childData[file];
    if (!!currentFileData.explorerEl) {
      fileItem.appendChild(currentFileData.explorerEl);
    } else {
      var itemDescriptor = document.createElement('span');
      itemDescriptor.innerHTML = '&#9660; ' + file;
      fileItem.appendChild(itemDescriptor);
      fileItem.appendChild(getChildNode(currentFileData));
    }

    filesContainer.appendChild(fileItem);
  });

  return filesContainer;
}

export function getExplorerContainerElement() {
  const el = document.createElement('div');
  el.classList.add('gcfe__container');

  return el;
}

export function getExplorerHeaderElement() {
  const el = document.createElement('h5');
  el.classList.add('gcfe__header');
  el.innerText = 'File Explorer';

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
  el.classList.add('gcfe');

  const emptyEl = removeElementChildren(el);
  return emptyEl;
}

export function getFilesContainerElement() {
  const el = document.createElement('div');
  el.classList.add(gh.fileWrapperClass);
  el.classList.add('gcfe__files');

  return el;
}

export function getExplorerItemElementWithName(name) {
  const el = document.createElement('span');
  el.classList.add('gcfe__item');
  el.innerText = name;

  return el;
}

export function addEachFileToContainer(els, container) {
  els.forEach(el => {
    el.classList.add('gcfe__file');
    fileContainerEl.appendChild(el);
  });
}
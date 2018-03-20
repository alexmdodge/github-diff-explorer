import './styles.css';
import deepExtend from './modules/extend';
import {
  getChildNode,
  getExplorerElement,
  getExplorerHeaderElement,
  removeElementChildren
} from './modules/utils';

console.log('GitHub Diff Explorer Loading . . .');
console.log('Document content loaded');

window.activeFileEl = '';
window.activeExplorerEl = '';

function setupExplorer() {
  // Specific classes pertaining to the GitHub diff review page. High
  // Likelihood that these could change.
  const fileWrapperClass = 'js-diff-progressive-container';
  const fileClass = 'file';
  const explorerContainerClass = 'diff-view';
  const pageContainerClass = 'new-discussion-timeline';
  const activeFileClass = 'gcfe__file--active';
  const activeExplorerClass = 'gcfe__item--active';

  // Get the diff containers and extract each individual file
  let fileEls = [...document.querySelectorAll(`.${fileWrapperClass}`)];
  fileEls = fileEls.map(el => {
    return [...el.children];
  });

  // Merge the fileEls into a single array and filter out any random
  // divs (probably used for other metadata)
  fileEls = [].concat(...fileEls);
  fileEls = fileEls.filter(file => file.classList.contains(fileClass));

  // Extract path data from the file
  let data = fileEls.map(file => {
    return {
      path: file.children[0].dataset.path,
      fileEl: file,
    };
  });

  // Modify the path to be a nested object with the roots
  // representing the changed file
  data = data.map((fileData, index) => {
    const pathFragments = fileData.path.split('/');
    pathFragments.reverse();

    const explorerEl = document.createElement('span');
    explorerEl.innerHTML = pathFragments[0];
    explorerEl.classList.add('gcfe__item');

    const reducer = (acc, path) => {
      return {
        [path]: acc
      }
    }

    const initialValue = {
      fileEl: fileData.fileEl,
      explorerEl: explorerEl,
    }

    if (index === 0) {
      activeExplorerEl = initialValue.explorerEl;
      activeFileEl = initialValue.fileEl;
      activeFileEl.classList.add(activeFileClass);
      activeExplorerEl.classList.add(activeExplorerClass);
    }

    initialValue.explorerEl.addEventListener('click', () => {
      activeFileEl.classList.remove(activeFileClass);
      activeExplorerEl.classList.remove(activeExplorerClass);
      activeFileEl = initialValue.fileEl;
      activeExplorerEl = initialValue.explorerEl;
      activeFileEl.classList.add(activeFileClass);
      activeExplorerEl.classList.add(activeExplorerClass);
    });

    return pathFragments.reduce(reducer, initialValue);
  });

  // Collect all similar levels of file changes
  const explorerData = deepExtend({}, ...data);

  // Build the nested file explorer using the normalized data tree
  const explorerEl = getExplorerElement();
  const explorerHeaderEl = getExplorerHeaderElement();
  explorerEl.appendChild(explorerHeaderEl);
  explorerEl.appendChild(getChildNode(explorerData));

  // Prep the existing file container on the page
  const explorerContainerEl = document.querySelector(`.${explorerContainerClass}`);
  explorerContainerEl.classList.add('gcfe');
  removeElementChildren(explorerContainerEl);

  // Merged all the files into one container
  const fileContainerEl = document.createElement('div');
  fileContainerEl.classList.add(fileWrapperClass);
  fileContainerEl.classList.add('gcfe__files');

  fileEls.forEach(el => {
    el.classList.add('gcfe__file');
    fileContainerEl.appendChild(el);
  });

  // Append the file explorer and the file viewer
  explorerContainerEl.appendChild(explorerEl);
  explorerContainerEl.appendChild(fileContainerEl);

  // Ensure page is full width
  var issuesListContainer = document.querySelector(`.${pageContainerClass}`);
  issuesListContainer.style.width = '95%';
}

setTimeout(setupExplorer, 1000);
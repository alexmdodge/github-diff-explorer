import deepExtend from './extend';
import { gh, styleClass } from './constants';
import {
  getChildNode,
  getExplorerContainerElement,
  getExplorerHeaderElement,
  getExplorerItemElementWithName,
  getFilesContainerElement,
  addEachFileToContainer,
  prepareEmptyDiffViewerElement,
  isValidHrefPath,
} from './dom';
import { getReversedPathFragments } from './paths';
import { onContentReady, onFilesLoaded, onLocationChanged } from './handlers';
import { setupPageStructure } from './structure';
import debug from './debug';

/**
 * The root class which handles extension state management
 * and construction of the file explorer.
 */
export default class Extension {
  constructor(globals) {
    this.fileEls = globals.fileEls;
    this.activeFileEl = globals.activeFileEl;
    this.activeExplorerEl = globals.activeExplorerEl;

    this.explorerData = {};
    this.currentHref = window.location.href;

    // Bind handler callbacks to the proper context
    this.handleContentReady = this.handleContentReady.bind(this);
    this.handleFilesLoaded = this.handleFilesLoaded.bind(this);
    this.handleLocationChanged = this.handleLocationChanged.bind(this);
  }

  init() {
    if (isValidHrefPath(this.currentHref)) {
      onContentReady(this.handleContentReady);
    }

    setTimeout(() => {
      onLocationChanged(this.currentHref, this.handleLocationChanged);
    }, 2000);
  }

  handleLocationChanged(nextHref) {
    this.currentHref = nextHref;
    debug.log('[handleLocationChanged] Location changed, setting content ready')

    onContentReady(this.handleContentReady)
  }

  handleContentReady() {
    onFilesLoaded(this.handleFilesLoaded);
  }
  
  handleFilesLoaded(fileEls) {
    this.fileEls = fileEls;
    setupPageStructure();

    this.buildFileExplorer();
  }

  buildFileExplorer() {
    parseFileExplorerData();
    
    // The explorer element is the file explorer located
    // to the left of the viewer.
    const explorerContainerEl = getExplorerContainerElement();
    const explorerHeaderEl = getExplorerHeaderElement();
    const nestedChildEl = getChildNode(this.explorerData);

    explorerContainerEl.appendChild(explorerHeaderEl);
    explorerContainerEl.appendChild(nestedChildEl);

    // The diff viewer is the container which has both the file
    // explorer and the file diffs.
    const diffViewerEl = prepareEmptyDiffViewerElement();

    // The files container element is the newly created container
    // which hosts the parsed file diffs. We keep the old container
    // around in case there is any JavaScript on the GitHub side
    // which still target it.
    const filesContainerEl = getFilesContainerElement();
    addEachFileToContainer(this.fileEls, filesContainerEl);

    diffViewerEl.appendChild(explorerContainerEl);
    diffViewerEl.appendChild(filesContainerEl);
  }

  parseFileExplorerData() {
    let pathData = extractPathDataFromElements(this.fileEls);
    let pathDataSet = parseEachPathAsNestedObject(pathData);
    this.explorerData = deepExtend({}, ...pathDataSet);
  }

  parseEachPathAsNestedObject(pathData) {
    return pathData.map((data, index) => {
      const pathFragments = getReversedPathFragments(data.path);
      const changedFileName = pathFragments[0];

      const changedFile = {
        fileEl: data.el,
        explorerItemEl: getExplorerItemElementWithName(changedFileName),
      }

      // Use the first file change as the first active file opened
      if (index === 0) {
        this.setActiveFile(changedFile);
      }

      changedFile.explorerItemEl.addEventListener('click', () => {
        this.clearActiveFile();
        this.setActiveFile(changedFile);
      });

      const reducer = (acc, path) => {
        return {
          [path]: acc
        }
      }

      return pathFragments.reduce(reducer, changedFile);
    });
  }

  setActiveFile(file) {
    this.activeExplorerEl = file.explorerEl;
    this.activeFileEl = file.fileEl;

    this.activeFileEl.classList.add(styleClass.activeFile);
    this.activeExplorerEl.classList.add(styleClass.activeExplorer);
  }

  clearActiveFile() {
    this.activeFileEl.classList.remove(styleClass.activeFile);
    this.activeExplorerEl.classList.remove(styleClass.activeExplorer);
  }
}
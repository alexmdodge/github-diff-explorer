import deepExtend from './extend';
import { gh, styleClass } from './constants';
import {
  generateExplorerFolderElements,
  getExplorerContainerElement,
  getExplorerHeaderElement,
  getExplorerItemElementWithName,
  getFilesContainerElement,
  addEachFileToContainer,
  prepareEmptyDiffViewerElement,
  setupPageStructure
} from './dom';
import { extractPathDataFromElements } from './structure';
import { getReversedPathFragments, isValidHrefPath } from './paths';
import { onContentReady, onFilesLoaded, onLocationChanged } from './handlers';
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
    this.parseFileExplorerData();

    // The explorer element is the file explorer located
    // to the left of the viewer.
    const explorerContainerEl = getExplorerContainerElement();
    const explorerHeaderEl = getExplorerHeaderElement();
    const nestedFolderEl = generateExplorerFolderElements(this.explorerData);

    explorerContainerEl.appendChild(explorerHeaderEl);
    explorerContainerEl.appendChild(nestedFolderEl);

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
    const pathData = extractPathDataFromElements(this.fileEls);
    debug.log('[parseFileExplorerData] Path data parsed: ', pathData);

    const pathDataSet = this.parseEachPathAsNestedObject(pathData);
    debug.log('[parseFileExplorerData] Path data nested as object: ', pathDataSet);

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
    this.activeFileEl = file.fileEl;
    this.activeExplorerEl = file.explorerItemEl;

    this.activeFileEl.classList.add(styleClass.activeFile);
    this.activeExplorerEl.classList.add(styleClass.activeExplorer);
  }

  clearActiveFile() {
    this.activeFileEl.classList.remove(styleClass.activeFile);
    this.activeExplorerEl.classList.remove(styleClass.activeExplorer);
  }
}
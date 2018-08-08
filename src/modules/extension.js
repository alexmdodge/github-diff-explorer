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
  setupPageStructure,
  getLoadingElement
} from './dom';
import { extractPathDataFromElements } from './structure';
import { getReversedPathFragments, isValidHrefPath, checkIfValidAnchor, checkIfHashContainsAnchor } from './paths';
import { onContentReady, onFilesLoaded, onLocationCheck } from './handlers';
import logger from './debug';

/**
 * The root class which handles extension state management
 * and construction of the file explorer.
 */
export default class Extension {
  constructor(globals) {
    this.fileEls = globals.fileEls;
    this.activeFileEl = globals.activeFileEl;
    this.activeExplorerEl = globals.activeExplorerEl;
    this.isExplorerParsing = false;
    this.loadingEl = null;

    this.explorerData = null;
    this.currentHref = window.location.href;

    // Bind handler callbacks to the proper context
    this.handleContentReady = this.handleContentReady.bind(this);
    this.handleFilesLoaded = this.handleFilesLoaded.bind(this);
    this.handleLocationChanged = this.handleLocationChanged.bind(this);
  }

  /**
   * Initialization entry of the extension. Monitors for a valid path
   * and when one is found it prepares the content to be loaded. It also
   * ensures the required DOM is fully loaded, containing all of the
   * diffs.
   */
  init() {
    if (isValidHrefPath(this.currentHref)) {
      onContentReady(this.handleContentReady);

       // Listen for future location changes and update content accordingly
      setTimeout(() => {
        onLocationCheck(this.currentHref, this.handleLocationChanged);
      }, 3000);
    } else {
      // TODO: Refactor to a view manager which ensures no timeouts are
      // repeated and handling is done more efficiently through promises
      onLocationCheck(this.currentHref, this.handleLocationChanged);      
    }
  }

  /**
   * Location update handler which is triggered when a user navigates
   * back to a valid pull request diff viewer page.
   */
  handleLocationChanged(nextHref) {
    this.currentHref = nextHref;

    // this.cleanupLoadingEl();

    if (!this.isExplorerParsing) {
      logger.log('[handleLocationChanged] Location changed, setting content ready');
      onContentReady(this.handleContentReady);
    }
  }

  /**
   * The DOM is fully loaded and ready to be processed
   */
  handleContentReady() {
    this.isExplorerParsing = true;

    // this.loadingEl = getLoadingElement();
    // document.querySelector('body').appendChild(this.loadingEl);

    onFilesLoaded(this.handleFilesLoaded);
  }
  
  /**
   * All diffs have loaded and the explorer can now be constructed
   * @param fileEls 
   */
  handleFilesLoaded(fileEls) {
    this.fileEls = fileEls;

    setupPageStructure();
    this.buildFileExplorer();
  }

  cleanupLoadingEl() {
    if (!this.loadingEl) {
      return;
    }

    this.loadingEl.remove();
    this.loadingEl = null;
  }

  /**
   * Processes the current diff structure and creates a file explorer
   * from the content.
   */
  buildFileExplorer() {
    this.parseFileExplorerData();

    // The explorer element is the file explorer located
    // to the left of the viewer.
    const explorerContainerEl = getExplorerContainerElement();
    const explorerHeaderEl = getExplorerHeaderElement(explorerContainerEl);
    const nestedFolderEl = generateExplorerFolderElements(this.explorerData);

    const nestedFolderElContainer = document.createElement('div');
    nestedFolderElContainer.classList.add(styleClass.explorerFolderTopContainer);
    nestedFolderElContainer.appendChild(nestedFolderEl);

    explorerContainerEl.appendChild(explorerHeaderEl);
    explorerContainerEl.appendChild(nestedFolderElContainer);

    // The diff viewer is the container which has both the file
    // explorer and the file diffs.
    const diffViewerEl = prepareEmptyDiffViewerElement();

    // The files container element is the newly created container
    // which hosts the parsed file diffs. We keep the old container
    // around in case there is any JavaScript on the GitHub side
    // which still targets it.
    const filesContainerEl = getFilesContainerElement();
    addEachFileToContainer(this.fileEls, filesContainerEl);

    logger.log('[buildFileExplorer] Explorer container prepared: ', explorerContainerEl);    
    logger.log('[buildFileExplorer] Files container prepared: ', filesContainerEl);
    logger.log('[buildFileExplorer] Appending files to viewer wrapper: ', diffViewerEl);

    diffViewerEl.appendChild(explorerContainerEl);
    diffViewerEl.appendChild(filesContainerEl);

    setTimeout(() => {
      logger.log('[buildFileExplorer] File explorer is complete: ', diffViewerEl);
      this.isExplorerParsing = false;

      // clearTimeout(loadingTimeout);
      // this.cleanupLoadingEl();
    }, 0);
  }

  parseFileExplorerData() {
    const pathData = extractPathDataFromElements(this.fileEls);
    logger.log('[parseFileExplorerData] Path data parsed: ', pathData);

    const pathDataSet = this.parseEachPathAsNestedObject(pathData);
    logger.log('[parseFileExplorerData] Path data nested as object: ', pathDataSet);

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

      const isValidAnchor = checkIfValidAnchor();

      if (!isValidAnchor && index === 0)
        this.setActiveFile(changedFile);
      else if (isValidAnchor) {
        const hashContainsAnchor = checkIfHashContainsAnchor(data.anchor);

        if (hashContainsAnchor) {
          this.setActiveFile(changedFile);
        }
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
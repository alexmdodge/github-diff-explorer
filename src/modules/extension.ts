import { deepExtendHtmlTerminated } from './extend'
import { styleClass } from './constants'
import {
  generateExplorerFolderElements,
  getExplorerContainerElement,
  getExplorerHeaderElement,
  getExplorerItemElementWithName,
  getFilesContainerElement,
  addEachFileToContainer,
  prepareEmptyDiffViewerElement,
  setupPageStructure
} from './dom'
import { extractPathDataFromElements, DecoratedFileElement, MappedFileElement, ExplorerDataMap } from './structure'
import { getReversedPathFragments, isValidHrefPath, checkIfValidAnchor, checkIfHashContainsAnchor } from './paths'
import { onContentReady, onFilesLoaded, onLocationCheck } from './handlers'
import logger from './debug'

/**
 * The root class which handles extension state management
 * and construction of the file explorer.
 */
export class Extension {
  private _fileEls: HTMLElement[] = []
  private _mappedFileEls: MappedFileElement[] = []
  private _loadingEl: HTMLElement | null
  private _activeFileEl: HTMLElement | null
  private _activeExplorerFileEl: HTMLElement | null

  private _isExplorerParsing: boolean
  private _explorerData: ExplorerDataMap
  private _currentHref: string

  public constructor() {  
    this._loadingEl = null
    this._activeFileEl = null
    this._activeExplorerFileEl = null
    
    this._isExplorerParsing = false
    this._explorerData = {}
    this._currentHref = window.location.href
  }

  get files(): HTMLElement[] {
    return this._fileEls
  }

  get mappedFiles(): MappedFileElement[] {
    return this._mappedFileEls
  }

  get activeFile(): HTMLElement | null {
    return this._activeFileEl
  }

  get activeExplorerFile(): HTMLElement | null {
    return this._activeExplorerFileEl
  }

  /**
   * Initialization entry of the extension. Monitors for a valid path
   * and when one is found it prepares the content to be loaded. It also
   * ensures the required DOM is fully loaded, containing all of the
   * diffs.
   */
  public init(): void {
    if (isValidHrefPath(this._currentHref)) {
      onContentReady()
        .then(() => this.handleContentReady())

      // Listen for future location changes and update content accordingly
      setTimeout(() => {
        onLocationCheck(this._currentHref)
          .then(nextHref => this.handleLocationChanged(nextHref))
      }, 3000)
    } else {
      // TODO: Refactor to a view manager which ensures no timeouts are repeated
      onLocationCheck(this._currentHref)
        .then(nextHref => this.handleLocationChanged(nextHref))
    }
  }

  /**
   * Location update handler which is triggered when a user navigates
   * back to a valid pull request diff viewer page.
   */
  handleLocationChanged(nextHref: string): void {
    this._currentHref = nextHref

    // this.cleanup_LoadingEl();

    // TODO: Check if active location is correct, if navigating away then reset
    // explorer and prepare a re-render on return

    // TODO: Better reset logic in general, provide external reset handlers to
    // test toggling the explorer on and off

    if (!this._isExplorerParsing) {
      logger.log('[handleLocationChanged] Location changed, setting content ready')
      onContentReady().then(() => this.handleContentReady())
    }
  }

  /**
   * The DOM is fully loaded and ready to be processed
   */
  handleContentReady(): void {
    this._isExplorerParsing = true

    // this._loadingEl = get_LoadingElement();
    // document.querySelector('body').appendChild(this._loadingEl);

    onFilesLoaded()
      .then(files => this.handleFilesLoaded(files))
      .catch(error => {
        logger.error(error)
      })
  }

  /**
   * All diffs have loaded and the explorer can now be constructed
   * @param _fileEls
   */
  handleFilesLoaded(_fileEls: HTMLElement[]): void {
    this._fileEls = _fileEls

    setupPageStructure()
    this.buildFileExplorer()
  }

  /**
   * Processes the current diff structure and creates a file explorer
   * from the content.
   */
  buildFileExplorer(): void {
    this.parseFileExplorerData()

    // The explorer element is the file explorer located
    // to the left of the viewer.
    const explorerContainerEl = getExplorerContainerElement()
    const explorerHeaderEl = getExplorerHeaderElement(explorerContainerEl)
    const nestedFolderEl = generateExplorerFolderElements(this._explorerData)

    const nestedFolderElContainer = document.createElement('div')
    nestedFolderElContainer.classList.add(styleClass.explorerFolderTopContainer)
    nestedFolderElContainer.appendChild(nestedFolderEl)

    explorerContainerEl.appendChild(explorerHeaderEl)
    explorerContainerEl.appendChild(nestedFolderElContainer)

    // The diff viewer is the container which has both the file
    // explorer and the file diffs.
    const diffViewerEl = prepareEmptyDiffViewerElement()

    // The files container element is the newly created container
    // which hosts the parsed file diffs. We keep the old container
    // around in case there is any JavaScript on the GitHub side
    // which still targets it.
    const filesContainerEl = getFilesContainerElement()
    addEachFileToContainer(this._fileEls, filesContainerEl)

    logger.log('[buildFileExplorer] Explorer container prepared: ', explorerContainerEl)
    logger.log('[buildFileExplorer] Files container prepared: ', filesContainerEl)
    logger.log('[buildFileExplorer] Appending files to viewer wrapper: ', diffViewerEl)

    diffViewerEl.appendChild(explorerContainerEl)
    diffViewerEl.appendChild(filesContainerEl)

    setTimeout(() => {
      logger.log('[buildFileExplorer] File explorer is complete: ', diffViewerEl)
      this._isExplorerParsing = false

      // clearTimeout(loadingTimeout);
      // this.cleanup_LoadingEl();
    }, 0)
  }

  parseFileExplorerData(): void {
    const decoratedFileEls = extractPathDataFromElements(this._fileEls)
    logger.log('[parseFileExplorerData] Decorated file elements: ', decoratedFileEls)

    const mappedFileEls = this.addDecoratedFileEventListeners(decoratedFileEls)
    this._mappedFileEls = mappedFileEls
    logger.log('[parseFileExplorerData] Mapped file elements: ', mappedFileEls)

    // Here we're going to iterate through the path and nest
    // the mapped file at the same place where it's nested
    // according to the path. This allows us to construct an
    // explorer object which looks very similar to the explorer
    // we're building
    const nestedPathData = mappedFileEls.map(mappedEl => {
      return getReversedPathFragments(mappedEl.path).reduce<ExplorerDataMap>(
        (acc, path) => ({ [path]: acc }),

        // Forcefully setting as any here, as we're just using this as a
        // convenience operation to inject the mapped element at the root
        // of this tree
        mappedEl as any
      )
    }) 
      
    this._explorerData = deepExtendHtmlTerminated({}, ...nestedPathData)
    logger.log('[parseFileExplorerData] Path data nested as object: ', mappedFileEls)
  }

  addDecoratedFileEventListeners(files: DecoratedFileElement[]): MappedFileElement[] {
    return files.map<MappedFileElement>((file, index) => {
      const filePathFragments = getReversedPathFragments(file.path)
      const fileName = filePathFragments[0]

      const mappedFile: MappedFileElement = {
        name: fileName,
        path: file.path,
        anchor: file.anchor,
        isViewed: false,
        rootFileEl: file.el,
        rootFileHeaderEl: file.el.children[0] as HTMLElement,
        explorerFileEl: getExplorerItemElementWithName(fileName)
      }

      // Set first pass data for viewed file element
      this.updateViewedFileStatus(mappedFile)

      // Set listener for future viewed file changes
      mappedFile.rootFileHeaderEl.addEventListener('click', (event: Event) => {
        const target = event.target as (HTMLElement | null)
        if (target?.classList.contains('js-reviewed-checkbox')) {
          this.updateViewedFileStatus(mappedFile)
        }
      })

      // Set first pass data for active file
      const isValidAnchor = checkIfValidAnchor()

      // TODO: Ensure returning to correctly deep linked elements, as this doesn't
      // always work in the current format
      if (!isValidAnchor && index === 0)
        this.setActiveFile(mappedFile)
      else if (isValidAnchor) {
        const hashContainsAnchor = checkIfHashContainsAnchor(file.anchor)

        if (hashContainsAnchor) {
          this.setActiveFile(mappedFile)
        }
      }

      // Set listener for future active file changes
      mappedFile.explorerFileEl.addEventListener('click', () => {
        this.clearActiveFile()
        this.setActiveFile(mappedFile)
      })

      return mappedFile
    })
  }

  setActiveFile(file: MappedFileElement): void {
    this._activeFileEl = file.rootFileEl
    this._activeExplorerFileEl = file.explorerFileEl

    this._activeFileEl.classList.add(styleClass.activeFile)
    this._activeExplorerFileEl.classList.add(styleClass.activeExplorer)
  }

  clearActiveFile(): void {
    this._activeFileEl?.classList.remove(styleClass.activeFile)
    this._activeExplorerFileEl?.classList.remove(styleClass.activeExplorer)

    this._activeFileEl = null
    this._activeExplorerFileEl = null
  }

  updateViewedFileStatus(file: MappedFileElement): void {
    file.isViewed = this.isViewedFile(file.rootFileEl)

    if (file.isViewed) {
      file.explorerFileEl.classList.add(styleClass.viewedExplorer)
    } else {
      file.explorerFileEl.classList.remove(styleClass.viewedExplorer)
    }
  }

  isViewedFile(file: HTMLElement): boolean {
    const rootFileHeader = file.children[0] as HTMLElement
    const rootFileHeaderViewedCheckbox = rootFileHeader.getElementsByClassName('js-reviewed-checkbox')[0] as HTMLElement
    const isViewedStatus = rootFileHeaderViewedCheckbox.getAttribute('data-ga-click')

    return isViewedStatus?.includes('true') ?? false
  }

  cleanupLoadingEl(): void {
    if (!this._loadingEl) {
      return
    }

    this._loadingEl.remove()
    this._loadingEl = null
  }
}
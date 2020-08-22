import { gh, styleClass } from './constants'
import icons from './icons'
import { ExplorerDataMap, MappedFileElement } from './structure'

/**
 * Functions for handling DOM structure generation, data properties, and
 * class additions.
 */
function isMappedFile(entry: ExplorerDataMap | MappedFileElement): entry is MappedFileElement {
  const possibleMappedFile = (entry as MappedFileElement)
  return typeof possibleMappedFile.name === 'string'
    && typeof possibleMappedFile.rootFileEl === 'object'
    && typeof possibleMappedFile.isViewed === 'boolean'
}


/**
 * Generates a nested list DOM structure based on the nested object passed 
 * to the function.
 */
export function generateExplorerFolderElements(explorerData: ExplorerDataMap): HTMLUListElement {
  const currentFolderDataKeys = Object.keys(explorerData)
  const explorerFolderEl = getExplorerFolderElement()

  currentFolderDataKeys.forEach(folderKey => {
    const nestedFolderEl = getNestedFolderElement()
    const currentFileData = explorerData[folderKey]

    if (isMappedFile(currentFileData)) {
      // If the explorer item element exists then we've
      // reached the end of the branch.
      nestedFolderEl.appendChild(currentFileData.explorerFileEl)
    } else {
      // If not create a folder header and continue to nest elements
      const folderDescriptor = getFolderDescriptorElementWithName(folderKey)
      nestedFolderEl.appendChild(folderDescriptor)
      nestedFolderEl.appendChild(generateExplorerFolderElements(currentFileData))
    }

    explorerFolderEl.appendChild(nestedFolderEl)
  })

  return explorerFolderEl
}

export function getLoadingElement(): HTMLDivElement {
  const el = document.createElement('div')
  el.classList.add(styleClass.loader)

  return el
}

export function removeElementChildren(el: HTMLElement): HTMLElement {
  while (el.firstChild) {
    el.removeChild(el.firstChild)
  }

  return el
}

export function prepareEmptyDiffViewerElement(): HTMLElement {
  const el = document.querySelector(`.${gh.explorerContainerClass}`) as HTMLElement
  el.classList.add(styleClass.root)

  const emptyEl = removeElementChildren(el)
  return emptyEl
}

export function setupPageStructure(): void {
  const issuesListContainer = document.querySelector(`.${gh.pageContainerClass}`) as HTMLElement
  issuesListContainer.classList.add(styleClass.pageContainer)
}

export function addEachFileToContainer(els: HTMLElement[], container: HTMLElement): void {
  els.forEach(el => {
    el.classList.add(styleClass.fileDiff)
    container.appendChild(el)
  })
}

/* DOM Creation */

export function getExplorerFolderElement(): HTMLUListElement {
  const el = document.createElement('ul')
  el.classList.add(styleClass.explorerFolderContainer)

  return el
}

export function getNestedFolderElement(): HTMLLIElement {
  const el = document.createElement('li')

  return el
}

export function getFolderDescriptorElementWithName(name: string): HTMLSpanElement {
  const el = document.createElement('span')
  el.classList.add(styleClass.explorerFolderHeader)
  el.innerHTML = `
    <span class="${styleClass.caretIcon}">
      ${icons.caretDown}
    </span>
    <span class="${styleClass.icon}">
      ${icons.folderOpen}
    </span>
    ${name}
  `

  el.addEventListener('click', () => {
    const isClosed = el.classList.contains(styleClass.closedFolder)

    if (isClosed) {
      el.classList.remove(styleClass.closedFolder)
      el.innerHTML = `
        <span class="${styleClass.caretIcon}">
          ${icons.caretDown}
        </span>
        <span class="${styleClass.icon}">
          ${icons.folderOpen}
        </span>
        ${name}
      `
    } else {
      el.classList.add(styleClass.closedFolder)
      el.innerHTML = `
        <span class="${styleClass.caretIcon}">
          ${icons.caretRight}
        </span>
        <span class="${styleClass.icon}">
          ${icons.folderClosed}
        </span>
        ${name}
      `
    }
  })

  return el
}

export function getExplorerContainerElement(): HTMLDivElement {
  const el = document.createElement('div')
  el.classList.add(styleClass.explorerContainer)

  return el
}

export function getExplorerHeaderElement(gdeContainer: HTMLElement): HTMLDivElement {
  const el = document.createElement('div')
  el.classList.add(styleClass.explorerHeader)

  const headerTitleElement = getExplorerHeaderTitle()
  const headerMenuElement = getExplorerHeaderMenuElement(gdeContainer)

  el.appendChild(headerTitleElement)
  el.appendChild(headerMenuElement)

  return el
}

function getExplorerHeaderTitle(): HTMLSpanElement {
  const container = document.createElement('span')
  const logo = document.createElement('img')
  const title = document.createElement('h5')

  container.classList.add(styleClass.explorerHeaderTitleContainer)

  title.classList.add(styleClass.explorerHeaderTitle)
  title.innerText = 'File Explorer'

  logo.classList.add(styleClass.explorerHeaderLogo)
  logo.src = icons.logo

  container.appendChild(logo)
  container.appendChild(title)

  return container
}

function getExplorerHeaderMenuElement(gdeContainer: HTMLElement): HTMLDivElement {
  const el = document.createElement('div')
  el.classList.add(styleClass.explorerHeaderMenu)

  const minBtn = document.createElement('span')
  const maxBtn = document.createElement('span')
  minBtn.classList.add(styleClass.explorerMenuButton)
  minBtn.classList.add(styleClass.explorerActiveMenuButton)
  maxBtn.classList.add(styleClass.explorerMenuButton)

  minBtn.title = 'Minimize Explorer'
  maxBtn.title = 'Maximize Explorer'

  minBtn.innerHTML = icons.minus
  maxBtn.innerHTML = icons.plus

  minBtn.addEventListener('click', () => {
    minBtn.classList.remove(styleClass.explorerActiveMenuButton)
    maxBtn.classList.add(styleClass.explorerActiveMenuButton)

    gdeContainer.classList.add(styleClass.minimizedContainer)
  })

  maxBtn.addEventListener('click', () => {
    maxBtn.classList.remove(styleClass.explorerActiveMenuButton)
    minBtn.classList.add(styleClass.explorerActiveMenuButton)

    gdeContainer.classList.remove(styleClass.minimizedContainer)
  })

  el.appendChild(minBtn)
  el.appendChild(maxBtn)

  return el
}

export function getFilesContainerElement(): HTMLDivElement {
  const el = document.createElement('div')
  el.classList.add(gh.fileWrapperClass)
  el.classList.add(styleClass.fileDiffContainer)

  return el
}

export function getExplorerItemElementWithName(name: string): HTMLSpanElement {
  const el = document.createElement('span')
  el.classList.add(styleClass.explorerItem)
  el.innerHTML = `
    <span class="${styleClass.icon} ${styleClass.fileIcon}">
      ${icons.file}
    </span>
    <span>
      ${name}
    </span>
  `

  return el
}

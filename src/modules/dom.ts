import { gh, PageColorTheme, styleClass } from './constants'
import { icons } from './icons'
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
export function generateExplorerFolderElements(explorerData: ExplorerDataMap, colorMode: PageColorTheme): HTMLUListElement {
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
      const folderDescriptor = getFolderDescriptorElementWithName(folderKey, colorMode)
      nestedFolderEl.appendChild(folderDescriptor)
      nestedFolderEl.appendChild(generateExplorerFolderElements(currentFileData, colorMode))
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

export function getAnnotationsContainerElement(els: HTMLElement[]): HTMLElement {
  const annotationElContainer = document.createElement('div')
  annotationElContainer.classList.add(styleClass.annotationContainer)

  if (els.length === 0) {
    return annotationElContainer
  }

  annotationElContainer.innerHTML = `
    <hr>
    <h3 class="mb-2">
      Unchanged files with check annotations
      <span class="Label border color-border-success color-text-primary m-0 v-align-middle">Beta</span>
    </h3>
  `.trim()

  els.forEach(el => {
    const clonedEl: HTMLElement = el.cloneNode(true) as HTMLElement
    clonedEl.classList.remove('Details--on')
    annotationElContainer.appendChild(clonedEl)
  })

  return annotationElContainer
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

function updateFolderIcons(el: HTMLSpanElement, caretIcon: HTMLElement, folderIcon: HTMLElement, name: string, colorMode: PageColorTheme) {
  const caretIconEl = document.createElement('span')
  caretIconEl.classList.add(styleClass.caretIcon)
  caretIconEl.appendChild(caretIcon)

  const fileIconEl = document.createElement('span')
  fileIconEl.classList.add(styleClass.icon)
  fileIconEl.appendChild(folderIcon)

  const nameEl = document.createElement('span')
  nameEl.innerText = name

  switch (colorMode) {
    case PageColorTheme.Dark:
      caretIconEl.classList.add(styleClass.caretIconDarkTheme)
      fileIconEl.classList.add(styleClass.iconDarkTheme)
      break

    default:
      caretIconEl.classList.add(styleClass.caretIconLightTheme)
      fileIconEl.classList.add(styleClass.iconLightTheme)
  }

  const clearedEl = removeElementChildren(el)
  clearedEl.appendChild(caretIconEl)
  clearedEl.appendChild(fileIconEl)
  clearedEl.appendChild(nameEl)
}

export function getFolderDescriptorElementWithName(name: string, colorMode: PageColorTheme): HTMLSpanElement {
  const el = document.createElement('span')
  el.classList.add(styleClass.explorerFolderHeader)

  switch (colorMode) {
    case PageColorTheme.Dark:
      el.classList.add(styleClass.explorerFolderHeaderDarkTheme)
      break

    default:
      el.classList.add(styleClass.explorerFolderHeaderLightTheme)
  }

  updateFolderIcons(el, icons.caretDown(), icons.folderOpen(), name, colorMode)

  el.addEventListener('click', () => {
    const isClosed = el.classList.contains(styleClass.closedFolder)

    if (isClosed) {
      el.classList.remove(styleClass.closedFolder)
      updateFolderIcons(el, icons.caretDown(), icons.folderOpen(), name, colorMode)
    } else {
      el.classList.add(styleClass.closedFolder)
      updateFolderIcons(el, icons.caretRight(), icons.folderClosed(), name, colorMode)
    }
  })

  return el
}

export function getExplorerContainerElement(colorMode: PageColorTheme): HTMLDivElement {
  const el = document.createElement('div')
  el.classList.add(styleClass.explorerContainer)

  switch (colorMode) {
    case PageColorTheme.Dark:
      el.classList.add(styleClass.explorerContainerDarkTheme)
      break

    default:
      el.classList.add(styleClass.explorerContainerLightTheme)
  }

  return el
}

export function getExplorerHeaderElement(gdeContainer: HTMLElement, colorMode: PageColorTheme): HTMLDivElement {
  const el = document.createElement('div')
  el.classList.add(styleClass.explorerHeader)

  switch (colorMode) {
    case PageColorTheme.Dark:
      el.classList.add(styleClass.explorerHeaderDarkTheme)
      break

    default:
      el.classList.add(styleClass.explorerHeaderLightTheme)
      
  }

  const headerTitleElement = getExplorerHeaderTitle(colorMode)
  const headerMenuElement = getExplorerHeaderMenuElement(gdeContainer)

  el.appendChild(headerTitleElement)
  el.appendChild(headerMenuElement)

  return el
}

function getExplorerHeaderTitle(colorMode: PageColorTheme): HTMLSpanElement {
  const container = document.createElement('span')
  const logo = document.createElement('img')
  const title = document.createElement('h5')

  container.classList.add(styleClass.explorerHeaderTitleContainer)

  title.classList.add(styleClass.explorerHeaderTitle)
  title.innerText = 'File Explorer'

  logo.classList.add(styleClass.explorerHeaderLogo)

  switch (colorMode) {
    case PageColorTheme.Dark:
      logo.src = icons.logoWhite
      break

    default:
      logo.src = icons.logoBlack
  }

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

  minBtn.appendChild(icons.minus())
  maxBtn.appendChild(icons.plus())

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

export function getExplorerItemElementWithName(name: string, colorMode: PageColorTheme): HTMLSpanElement {
  const el = document.createElement('span')
  el.classList.add(styleClass.explorerItem)

  let innerFileEl = document.createElement('span')
  innerFileEl.classList.add(styleClass.icon, styleClass.fileIcon)
  innerFileEl = removeElementChildren(innerFileEl)
  innerFileEl.appendChild(icons.file())

  switch (colorMode) {
    case PageColorTheme.Dark:
      el.classList.add(styleClass.explorerItemDarkTheme)
      innerFileEl.classList.add(styleClass.iconDarkTheme)
      break

    default:
      el.classList.add(styleClass.explorerItemLightTheme)
      innerFileEl.classList.add(styleClass.iconLightTheme)
  }
  
  const nameEl = document.createElement('span')
  nameEl.innerText = name

  const clearedEl = removeElementChildren(el)
  clearedEl.appendChild(innerFileEl)
  clearedEl.appendChild(nameEl)

  return el
}

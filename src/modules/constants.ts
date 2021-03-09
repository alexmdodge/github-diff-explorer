export const gh = {
  fileClass: 'file',

  // Note that this class seems to appear on diffs
  // that are the pure diffs, and not the files
  // that are the unchanged annotations
  fileClassTargetableEl: 'js-targetable-element',
  fileWrapperClass: 'js-diff-progressive-container',
  explorerContainerClass: 'diff-view',
  pageContainerClass: 'new-discussion-timeline',
  filesChangedId: 'files_tab_counter'
}

/* Extension specific classes */
export const styleClass = {
  root: 'gde',
  icon: 'gde__icon',
  iconDarkTheme: 'gde__icon--dark-theme',
  iconLightTheme: 'gde__icon--light-theme',
  loader: 'gde__loader',
  fileIcon: 'gde__file-icon',
  caretIcon: 'gde__caret-icon',
  caretIconDarkTheme: 'gde__caret-icon--dark-theme',
  caretIconLightTheme: 'gde__caret-icon--light-theme',
  pageContainer: 'gde__page',
  activeFile: 'gde__file--active',
  activeExplorer: 'gde__item--active',
  viewedExplorer: 'gde__item--viewed',
  explorerContainer: 'gde__container',
  explorerContainerDarkTheme: 'gde__container--dark-theme',
  explorerContainerLightTheme: 'gde__container--light-theme',
  minimizedContainer: 'gde__container--minimized',
  explorerHeader: 'gde__header',
  explorerHeaderDarkTheme: 'gde__header--dark-theme',
  explorerHeaderLightTheme: 'gde__header--light-theme',
  minimizedHeaderContainer: 'gde__header--minimized',
  explorerHeaderTitle: 'gde__header-title',
  minimizedHeaderTitle: 'gde__header-title--minimized',
  explorerHeaderLogo: 'gde__header-logo',
  explorerHeaderTitleContainer: 'gde__header-title-container',
  explorerFolderHeader: 'gde__folder-header',
  explorerFolderHeaderDarkTheme: 'gde__folder-header--dark-theme',
  explorerFolderHeaderLightTheme: 'gde__folder-header--light-theme',
  explorerHeaderMenu: 'gde__folder-header-menu',
  explorerMenuButton: 'gde__menu-btn',
  explorerActiveMenuButton: 'gde_menu-btn--active',
  explorerItem: 'gde__item',
  explorerItemDarkTheme: 'gde__item--dark-theme',
  explorerItemLightTheme: 'gde__item--light-theme',
  annotationContainer: 'gde__annotations',
  fileDiffContainer: 'gde__files',
  fileDiff: 'gde__file',  
  explorerFolderContainer: 'gde__nested-files',
  explorerFolderTopContainer: 'gde__nested-files-container',
  closedFolder: 'gde__folder-closed'
}

export enum PageColorTheme {
  Light = 'light',
  Dark = 'dark'
}

export const mapPageColorTheme = (color?: string): PageColorTheme => {
  switch (color) {
    case PageColorTheme.Dark:
      return PageColorTheme.Dark
    case PageColorTheme.Light:
    default:
      return PageColorTheme.Light
  }
}
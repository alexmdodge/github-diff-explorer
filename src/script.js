import Extension from './modules/extension';
import './styles.css';

const globals = window.GHFE_GLOBALS = {
  filesEls: null,
  activeFileEl: null,
  activeExplorerEl: null,
}

/**
 * Extension Initialization
 * 
 * This extension uses a common abbreviation to represent the
 * extension's classes and other useful data properties.
 * 
 * GHFE - GitHub File Explorer
 * 
 */
const ghfeExtension = new Extension(globals);
ghfeExtension.init();

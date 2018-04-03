import Extension from './modules/extension';
import './styles.css';

const globals = window.GDE_GLOBALS = {
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
 * GDE - GitHub Diff Explorer
 * 
 */
const gdeExtension = new Extension(globals);
gdeExtension.init();

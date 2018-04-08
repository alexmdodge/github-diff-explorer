import Extension from './modules/extension';
import debug from './modules/debug';
import './styles.scss';

// TODO: Expose these to the window on dev
const globals = {
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

debug.log('GitHub Diff Explorer initialized in Development Mode');
import { Extension } from './modules/extension'
import logger from './modules/debug'
import './styles.css'

declare let global: any

export interface GDEGlobalData {
  filesEls: any,
  activeFileEl: any,
  activeExplorerEl: any
}

// TODO: Expose these to the window on dev
const GDE_GLOBALS: GDEGlobalData = {
  filesEls: null,
  activeFileEl: null,
  activeExplorerEl: null
}
global.GDE_GLOBALS = GDE_GLOBALS

/**
 * Extension Initialization
 * 
 * This extension uses a common abbreviation to represent the
 * extension's classes and other useful data properties.
 * 
 * GDE - GitHub Diff Explorer
 * 
 */
const gdeExtension = new Extension(GDE_GLOBALS)
gdeExtension.init()

logger.log('GitHub Diff Explorer initialized in Development Mode')
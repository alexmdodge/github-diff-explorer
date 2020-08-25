import { Extension } from './modules/extension'
import { isDev } from './modules/env'
import { Logger } from './modules/logger'
import './styles.css'

/**
 * Extension Initialization
 * 
 * This extension uses an abbreviation to represent the
 * extension's classes and other useful data properties.
 * 
 * GDE - GitHub Diff Explorer
 */
const gdeExtension = new Extension()
gdeExtension.init()

if (isDev) {
  // Note that Chrome extensions can't modify or access
  // properties from the global object directly (makes sense),
  // so to aid with debugging we'll need to incorporate query
  // params and interval logging of the top level extension.
  setInterval(() => {
    Logger.debug('[GDE Global] Extension state snapshot: ', gdeExtension)
  }, 5000)
}

Logger.log('[GDE Global] GitHub Diff Explorer initialized in Development Mode')
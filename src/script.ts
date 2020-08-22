import { Extension } from './modules/extension'
import { isDev } from './modules/env'
import logger from './modules/debug'
import './styles.css'

declare let global: any

/**
 * Extension Initialization
 * 
 * This extension uses a common abbreviation to represent the
 * extension's classes and other useful data properties.
 * 
 * GDE - GitHub Diff Explorer
 */
const gdeExtension = new Extension()
gdeExtension.init()

if (isDev) {
  global.GDE_EXTENSION_INSTANCE = gdeExtension
}

logger.log('GitHub Diff Explorer initialized in Development Mode')
import { isDev } from './env'

/**
 * Simple debug wrapper which accepts boolean for different code
 * environments.
 */
class Logger {
  // TODO: Add basic category and levels support through query params
  // private _categories: string[] 
  private _levels: string[]

  constructor() {
    this._levels = [ 'log', 'error' ]
  }

  get levels() {
    return this._levels
  }

  updateLevels(levels: string[]) {
    if (Array.isArray(levels) && typeof levels[0] === 'string') {
      this._levels = levels
    }
  }

  log(msg: string, ...args: any[]): void {
    if (isDev && this._levels.includes('log')) {
      console.log(msg, ...args)
    }
  }

  debug(msg: string, ...args: any[]): void {
    if (isDev && this._levels.includes('debug')) {
      console.debug(msg, ...args)
    }
  }

  warn(msg: string, ...args: any[]): void {
    if (isDev && this._levels.includes('warn')) {
      console.warn(msg, ...args)
    }
  }

  error(msg: string, ...args: any[]): void {
    if (isDev && this._levels.includes('error')) {
      console.error(msg, ...args)
    }
  }
}

const LoggerSingleton = new Logger()

export {
  LoggerSingleton as Logger
}

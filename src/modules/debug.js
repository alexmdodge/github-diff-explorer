import { isDev } from './env';

/**
 * Simple debug wrapper which accepts boolean for different code
 * environments.
 */
const logger = {
  log(msg, args) {
    if (isDev) {
      console.log(msg, args);
    }
  },
  debug(msg, args) {
    if (isDev) {
      console.debug(msg, args);
    }
  }
}

export default logger;
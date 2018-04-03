import { isDev } from './env';

/**
 * Simple debug wrapper which accepts boolean for different code
 * environments.
 */
const debug = {
  log(msg, args) {
    if (isDev) {
      console.log(msg, args);
    }
  }
}

export default debug;
const rootPackage = require('../../package.json')

/**
 * Extension manifest settings specific to Chrome:
 * https://developer.chrome.com/extensions/manifest
 */
module.exports = {
  icons: {
    16: "images/icon16.png",
    48: "images/icon48.png",
    128: "images/icon128.png"
  },
  browser_action: {
    default_icon: {
        16: "images/icon16.png",
        48: "images/icon48.png",
        128: "images/icon128.png"
    }
  },
  version_name: rootPackage.version,
  offline_enabled: true,
}

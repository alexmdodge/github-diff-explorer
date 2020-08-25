const rootPackage = require('../../package.json')

/**
 * Templated local variables
 */
module.exports = {
  extName: {
    message: rootPackage.config.name.extension,
    description: "Name of the extension"
  }
}
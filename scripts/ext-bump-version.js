const rootPackage = require('../package.json')
const { version } = require('webpack')

/**
 * Helper utilities for paths and file replacement
 */

const fromRoot = (subPath) => path.resolve(__dirname, '../', subPath)

function replaceInFile(source, replaceWith, filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (error, rawFileData) => {
      if (error) {
        reject(error)
        return
      }

      const sourceRegex = new RegExp(source, 'g')
      const replacedFileData = rawFileData.replace(sourceRegex, replaceWith);
    
      fs.writeFile(filePath, replacedFileData, 'utf8', error => {
        if (error) {
          reject(error)
          return
        }

        resolve()
      })
    })
  })
}

// Get the current version
const currentVersion = rootPackage.version

// Break the version into fragments
const versionFragments = currentVersion.split('.')

// Determine versioning type and increment the corresponding fragment
// Also reset any version which is less than the version provided.
// ex. MAJOR bump will reset MINOR and PATCH
switch(process.env.VERSION_TYPE) {
  case 'PATCH':
    versionFragments[2] = versionFragments[2] + 1
    break

  case 'MINOR':
    versionFragments[2] = 0
    versionFragments[1] = versionFragments[1] + 1
    break

  case 'MAJOR':
    versionFragments[2] = 0
    versionFragments[1] = 0
    versionFragments[0] = versionFragments[0] + 1
    break

  default:
    versionFragments = process.argv[1].split('.')

    if (versionFragments.length < 3) {
      throw new Error('No version type was detected, and no direct version was passed in')
    }
}

// Join the new version
const newVersion = versionFragments.join('.')

// Replace in required files
const files = [
  fromRoot('package.json'),
  fromRoot('package-lock.json')
]

;(async () => {
  for (file of files) {
    await replaceInFile(currentVersion, newVersion, file)
  }
})()
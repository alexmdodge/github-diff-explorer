const fs = require('fs-extra')
const path = require('path')
const execa = require('execa')

const fromRoot = (subPath) => path.resolve(__dirname, '../', subPath)

const TARGET_BROWSER = process.env.GDE_BROWSER

if (!TARGET_BROWSER) {
  throw new Error('Browser target was not provided')
}

const outputFileName = `gde-extension-${TARGET_BROWSER}`
const outputFileZippedName = `${outputFileName}.zip`
const packedDir = fromRoot(`dist`)
const targetDir = fromRoot(`dist/${TARGET_BROWSER}`)

// Remove the zip file if already in the directory
fs.removeSync(path.join(packedDir, outputFileZippedName))

// Zip the folder to the target packed directory
process.chdir(targetDir)

;(async () => {
  await execa('zip', ['-r', `../${outputFileZippedName}`, `.`])
})()

// Move the file into the extensions directory
//fs.moveSync(fromRoot(outputFileZippedName), packedDir)
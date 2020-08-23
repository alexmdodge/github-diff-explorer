const fs = require('fs-extra')
const path = require('path')
const { merge } = require('webpack-merge');

const TARGET_BROWSER = process.env.GDE_BROWSER

if (!TARGET_BROWSER) {
  throw new Error('Browser target was not provided')
}

const fromRoot = (subPath) => path.resolve(__dirname, '../', subPath)

const targetDir = fromRoot(`dist/${TARGET_BROWSER}`)
const templateDir = fromRoot('extension/template')

// Ensure target directory is empty and exists
fs.ensureDirSync(targetDir)

fs.emptyDirSync(targetDir)

// Copy template directory to specific browser directory
fs.copySync(templateDir, targetDir)

// Generate metadata and deep merge
const rootManifest = require('../extension/metadata/manifest')
const browserManifest = require(`../extension/metadata/manifest.${TARGET_BROWSER}`)

const locale_en = require('../extension/metadata/locale_en')
const manifest = merge(rootManifest, browserManifest)

// Copy metadata to correct browser target
fs.writeFileSync(fromRoot(`dist/${TARGET_BROWSER}/manifest.json`), JSON.stringify(manifest, null, 2))

fs.ensureDirSync(fromRoot(`dist/${TARGET_BROWSER}/_locales/en`))
fs.writeFileSync(fromRoot(`dist/${TARGET_BROWSER}/_locales/en/messages.json`), JSON.stringify(locale_en, null, 2))

<img src="https://i.imgur.com/kthxYY7.pngg" width="900px">

The GitHub Diff Explorer is a browser extension which generates a seamless file explorer with a minimalist focus. Available in both Chrome and Firefox for GitHub.

A big thanks to [Andela Denaro](https://github.com/andeladenaro) for the logo and banner design!

<img src="https://i.imgur.com/WzrhAXe.png" width="900px">

## Features

* More screen real estate with a full width view and a re-sizable explorer
* Improved review management and organization with collapsible folder views
* Deep links to line references and review comments

## Install

This extension requires:

* Node (>v8)
* NPM (>v5)

To test this locally in Chrome:

* Pull this repository locally
* `npm install`
* `npm start` will run a local development copy, un-minified, with logging enabled
* Navigate to `chrome://extensions/`
* Enable developer mode
* Load unpacked extension from `dist/chrome`
* Go to a GitHub `Files Changed` tab in any repo.
* Enjoy!

## Release

To build a full released version for both Chrome and Firefox:

* `npm install`
* `npm run release`

Deployed `.zip` files and production assets will be deployed to `dist/chrome` and `dist/firefox` respectively.

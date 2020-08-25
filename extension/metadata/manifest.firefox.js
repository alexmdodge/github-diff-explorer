/**
 * Extension manifest settings specific to Firefox. So far this
 * only appears to be the icon sizes:
 * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json
 */
module.exports = {
  icons: {
    48: "images/icon48.png",
    96: "images/icon96.png"
  },
  browser_action: {
    default_icon: {
        48: "images/icon48.png",
        96: "images/icon96.png"
    }
  }
}

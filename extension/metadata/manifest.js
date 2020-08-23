const rootPackage = require('../../package.json')

/**
 * Root manifest shared by all browser extensions.
 */
module.exports = {
    manifest_version: 2,
    name: "__MSG_extName__",
    default_locale: "en",
    version: rootPackage.version,
    description: rootPackage.description,
    author: rootPackage.author,
    short_name: rootPackage.config.name.extension,

    // REQUIRED: These values will be merged according to the specific
    //           browser manifest requirements.
    icons: {},

    browser_action: {
        // REQUIRED: These values will be merged according to the specific
        //           browser manifest requirements.
        default_icon: {},
        default_title: rootPackage.config.name.extension,
        default_popup: "popup.html"
    },
    content_scripts: [
        {
            matches: [
                "https://github.com/*/*"
            ],
            css: [`lib/${rootPackage.config.name.style}.css`],
            js: [`lib/${rootPackage.config.name.script}.js`],
            run_at: "document_end"
        }
    ],
    permissions: [
        "https://github.com/"
    ]
  }

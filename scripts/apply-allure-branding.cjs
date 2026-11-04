// Applies Capitec branding to the bundled allure-commandline install.
// Runs on postinstall and before report:generate, since node_modules is
// reinstalled from scratch (gitignored) and won't keep manual edits.
'use strict'

const fs = require('fs')
const path = require('path')

const ALLURE_DIST = path.join(__dirname, '..', 'node_modules', 'allure-commandline', 'dist')
const CONFIG_PATH = path.join(ALLURE_DIST, 'config', 'allure.yml')
const PLUGIN_STYLES_PATH = path.join(ALLURE_DIST, 'plugins', 'custom-logo-plugin', 'static', 'styles.css')
const SOURCE_STYLES_PATH = path.join(__dirname, 'allure-branding', 'styles.css')

if (!fs.existsSync(ALLURE_DIST)) {
    console.warn('[allure-branding] allure-commandline not installed yet, skipping')
    process.exit(0)
}

const config = fs.readFileSync(CONFIG_PATH, 'utf8')
if (!/^\s*-\s*custom-logo-plugin\s*$/m.test(config)) {
    fs.writeFileSync(CONFIG_PATH, config.replace(/^plugins:\s*\n/m, 'plugins:\n  - custom-logo-plugin\n'))
}

fs.copyFileSync(SOURCE_STYLES_PATH, PLUGIN_STYLES_PATH)

console.log('[allure-branding] Capitec theme applied to Allure report')

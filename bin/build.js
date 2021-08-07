const { execSync } = require("child_process");

// Clean directories used in building process
function cleanBuildSteps () {
    execSync(`rm -rf ./build-tsc ./build-babel`)
}
function cleanOutputDir () {
    execSync(`rm -rf ./dist`)
}
// Compile TypeScript files to JavaScript
function compileTypeScript () {
    execSync(`./node_modules/.bin/tsc`)
}
// Run Babel to ensure backward-compability
function runBabel () {
    execSync(`./node_modules/.bin/babel ./build-tsc --out-dir ./build-babel --source-maps`)
}
// Run Webpack to ensure everything runs in browser environment
function runWebpack () {
    execSync(`webpack`)
}

// Start build process
function build () {
    cleanOutputDir()
    cleanBuildSteps()
    compileTypeScript()
    runBabel()
    runWebpack()
    cleanBuildSteps()
}

module.exports.build = build
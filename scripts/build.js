// For bazel genrules, we need to do a few steps first
if(process.argv.length != 5) {
  console.error("Error! build.js requires 3 positional arguments: 1) the path to package json 2) the destination directory for the built files, 3) the app name- e.g. \"lobby\"");
  process.exit(1)
}

const path = require('path');
var packageJsonPath = path.resolve(process.argv[2]);
var packageJsonDir = path.dirname(packageJsonPath);
var destDir = path.resolve(process.argv[3]);
var appName = process.argv[4];

const fs = require('fs-extra');
// Change into the package json directory for react-scripts to work
process.chdir(packageJsonDir);

const rewire = require('rewire');
const MiniCssExtractPlugin = require('react-scripts/node_modules/mini-css-extract-plugin');
//TODO remove these
//const ESLintWebpackPlugin = require('react-scripts/node_modules/eslint-webpack-plugin');
const webpack = require('react-scripts/node_modules/webpack');
process.env.SKIP_PREFLIGHT_CHECK = 'true';
console.log("BEFORE");
const defaults = rewire('react-scripts/scripts/build.js');
console.log("AFTER");
const config = defaults.__get__('config');
const paths = defaults.__get__('paths');

//Need to make sure we output to a sensibly named directory - i.e. build/ won't cut it
if(!(fs.existsSync(destDir) && fs.lstatSync(destDir).isDirectory())) {
  fs.mkdirSync(destDir, {recursive: true});
}
paths.appBuild = destDir;

console.log(paths);

// Consolidate chunk files instead
config.optimization.splitChunks = {
  cacheGroups: {
    default: false,
  },
};
// Move runtime into bundle instead of separate file
config.optimization.runtimeChunk = false;

// JS
config.output.filename = "static/js/[name].js";
config.output.path = destDir;
// CSS remove MiniCssPlugin
config.plugins = config.plugins.filter(plugin =>
    !(plugin instanceof MiniCssExtractPlugin));
// Add a define plugin for the appName
config.plugins.unshift(new webpack.DefinePlugin({
  APP_NAME: JSON.stringify(appName),
  APP_NAME_JS: JSON.stringify("./" + appName + ".js")
}));
// CSS replaces all MiniCssExtractPlugin.loader with style-loader
config.module.rules[1].oneOf = config.module.rules[1].oneOf.map(rule => {
    if (!rule.hasOwnProperty('use')) return rule;
    return Object.assign({}, rule, {
        use: rule.use.map(options => /mini-css-extract-plugin/.test(options.loader)
            ? {loader: require.resolve('style-loader'), options: {}}
            : options)
    });
});

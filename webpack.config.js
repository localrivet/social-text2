/**
 * Webpack main configuration file
 */

const path = require('path');
const fs = require('fs');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const environment = require('./configuration/environment');

const templateFiles = fs.readdirSync(path.resolve(__dirname, environment.paths.source)).filter(template => /\.html/.test(template));
const htmlPluginEntries = templateFiles.map((template) => {
  return new HTMLWebpackPlugin({
    inject: true,
    hash: false,
    filename: template,
    template: path.resolve(environment.paths.source, template),
    favicon: path.resolve(environment.paths.source, '../', 'favicon.ico'),
  });
});

module.exports = {
  entry: {
    "social-text": path.resolve(environment.paths.source, 'main.ts'),
  },
  output: {
    filename: 'js/[name].js',
    path: environment.paths.output,
    libraryTarget: 'umd',
    library: 'SocialText'
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: "ts-loader"
      }
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      verbose: true,
    }),
  ].concat(htmlPluginEntries),
  target: 'web',
};

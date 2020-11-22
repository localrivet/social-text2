/**
 * Webpack main configuration file
 */

const path = require('path');
const fs = require('fs');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const environment = require('./configuration/environment');

const templateFiles = fs.readdirSync(path.resolve(__dirname, environment.paths.source));
const htmlPluginEntries = templateFiles.map((template) => {

  console.log({
    inject: true,
    hash: false,
    filename: template,
    template: path.resolve(environment.paths.source, template),
    // favicon: path.resolve(environment.paths.source, 'images', 'favicon.ico'),
  });


  return new HTMLWebpackPlugin({
    inject: true,
    hash: false,
    filename: template,
    template: path.resolve(environment.paths.source, template),
    // favicon: path.resolve(environment.paths.source, 'images', 'favicon.ico'),
  });
});

module.exports = {
  entry: {
    app: path.resolve(environment.paths.source, 'main.ts'),
  },
  output: {
    filename: 'js/[name].js',
    path: environment.paths.output,
    libraryTarget: 'umd',
    library: 'SocialText'
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js"]
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

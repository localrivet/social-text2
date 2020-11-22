/**
 * Webpack main configuration file
 */

const path = require('path');
const fs = require('fs');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const environment = require('./configuration/environment');

const templateFiles = fs.readdirSync(path.resolve(__dirname, environment.paths.source));
const htmlPluginEntries = templateFiles.map((template) => new HTMLWebpackPlugin({
  inject: true,
  hash: false,
  filename: template,
  template: path.resolve(environment.paths.source, template),
  // favicon: path.resolve(environment.paths.source, 'images', 'favicon.ico'),
}));


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
        test: /\.tsx?$/,
        loader: "ts-loader"
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      verbose: true,
    }),
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: path.resolve(environment.paths.source, 'images', 'content'),
    //       to: path.resolve(environment.paths.output, 'images', 'content'),
    //       toType: 'dir',
    //       globOptions: {
    //         ignore: ['*.DS_Store', 'Thumbs.db'],
    //       },
    //     },
    //   ],
    // }),
  ].concat(htmlPluginEntries),
  target: 'web',
};

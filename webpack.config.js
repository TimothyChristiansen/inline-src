const webpack = require('webpack');
const path = require('path');

module.exports = {
  target: "node",  
  entry: path.resolve(__dirname, 'src', 'inline-src.ts'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'inline-src.js',
    libraryTarget: 'commonjs2' // For Node.js environments
  },
  optimization: {
    usedExports: false,
    minimize: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'swc-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new webpack.BannerPlugin({ banner: '#!/usr/bin/env node', raw: true })
  ]
};
const path = require('path');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
require('dotenv').config();

module.exports = {
  mode: 'development',
  devtool: 'eval',
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.jsx', '.json', '.css'],
  },
  entry: {
    app: './src/client',
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: '> 0.25%, not dead',
                  modules: false,
                },
              ],
              [
                '@babel/preset-react',
                {
                  runtime: 'automatic',
                  importSource: '@emotion/react',
                },
              ],
              '@emotion/babel-preset-css-prop',
            ],
            plugins: [
              'react-refresh/babel',
              [
                '@babel/plugin-transform-runtime',
                {
                  corejs: 3,
                },
              ],
              '@emotion',
            ],
          },
        },
      },
      {
        test: /\.css$/i,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(jpe?g|gif|png|svg|ico)?$/i,
        type: 'asset',
        generator: {
          filename: 'images/[name].[ext]?[hash]',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset',
        generator: {
          filename: 'fonts/[name].[ext]?[hash]',
        },
      },
    ],
  },
  plugins: [
    new ReactRefreshWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[chunkhash].js',
    publicPath: '/',
  },
  devServer: {
    hot: true,
    port: 3000,
    static: {
      directory: path.join(__dirname, 'public'),
      publicPath: '/public',
    },
    historyApiFallback: true,
    compress: true,
  },
};

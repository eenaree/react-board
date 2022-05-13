const path = require('path');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');
const { merge } = require('webpack-merge');
require('dotenv').config();

const isDevelopment = process.env.NODE_ENV !== 'production';

const commonConfig = {
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
            ],
            env: {
              development: {
                plugins: [
                  require.resolve('react-refresh/babel'),
                  ['@babel/plugin-transform-runtime', { corejs: 3 }],
                  [
                    '@emotion',
                    { labelFormat: '[dirname]-[filename]--[local]' },
                  ],
                ],
              },
              production: {
                plugins: [
                  ['@babel/plugin-transform-runtime', { corejs: 3 }],
                  '@emotion',
                ],
              },
            },
          },
        },
      },
      {
        test: /\.css$/i,
        use: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
        ],
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
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: isDevelopment ? 'development' : 'production',
    }),
  ],
};

const developmentConfig = {
  mode: 'development',
  devtool: 'eval-source-map',
  plugins: [new ReactRefreshWebpackPlugin(), new BundleAnalyzerPlugin()],
  output: {
    path: path.join(__dirname, 'build'),
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

const productionConfig = {
  mode: 'production',
  devtool: 'hidden-source-map',
  plugins: [
    new BundleAnalyzerPlugin({ analyzerMode: 'static' }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].[chunkhash].js',
  },
};

const config = () => {
  if (isDevelopment) {
    return merge(commonConfig, developmentConfig);
  }
  return merge(commonConfig, productionConfig);
};

module.exports = config;

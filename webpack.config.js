const webpack = require('webpack');
const path = require('path');

// variables
const isProduction = process.argv.indexOf('-p') >= 0;
const sourcePath = path.join(__dirname, './src');
const outPath = path.join(__dirname, './dist');

// plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractSass = new ExtractTextPlugin({
  filename: "[name].[contenthash].css",
  //disable: process.env.NODE_ENV === "development"
});
const {
  TsConfigPathsPlugin,
  CheckerPlugin
} = require('awesome-typescript-loader');

module.exports = {
  context: sourcePath,
  entry: {
    main: './index.tsx',
    vendor: [
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'redux'
    ]
  },
  output: {
    path: outPath,
    publicPath: '/',
    filename: 'bundle.js',
  },
  target: 'web',
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    // Fix webpack's default behavior to not load packages with jsnext:main module
    // https://github.com/Microsoft/TypeScript/issues/11677 
    mainFields: ['main'],
    alias: {
      app: path.resolve(__dirname, 'src/app/'),
      messaging: path.resolve(__dirname, 'src/messaging/'),
      store: path.resolve(__dirname, 'src/store/'),
    }
  },
  module: {
    rules: [
      // .ts, .tsx
      {
        test: /\.tsx?$/,
        use: isProduction ?
          'awesome-typescript-loader?module=es6' :
          [
            'react-hot-loader',
            'awesome-typescript-loader'
          ]
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
              loader: 'css-loader',
              query: {
                modules: true,
                sourceMap: !isProduction,
                importLoaders: 1,
                localIdentName: '[local]__[hash:base64:5]'
              }
            },
            {
              loader: 'postcss-loader'
            }
          ]
        })
      },
      { // sass / scss loader for webpack
        test: /\.scss$/,
        use: extractSass.extract({
          use: ["css-loader", "sass-loader"],
          // use style-loader in development 
          fallback: "style-loader"
        })
      },
      // static assets 
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.png$/,
        loader: 'url-loader?limit=10000'
      },
      {
        test: /\.jpg$/,
        loader: 'file-loader'
      },
    ],
  },
  plugins: [
    new TsConfigPathsPlugin(),
    new CheckerPlugin(),
    new webpack.LoaderOptionsPlugin({
      options: {
        context: sourcePath,
        postcss: [
          require('postcss-import')({
            addDependencyTo: webpack
          }),
          require('postcss-url')(),
          require('postcss-cssnext')(),
          require('postcss-reporter')(),
          require('postcss-browser-reporter')({
            disabled: isProduction
          }),
        ]
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.bundle.js',
      minChunks: Infinity
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    extractSass,
    new HtmlWebpackPlugin({
      template: 'index.html'
    })
  ],
  devServer: {
    contentBase: sourcePath,
    hot: true,
    stats: {
      assets: false,
      cached: false,
      cachedAssets: false,
      children: false,
      chunks: false,
      chunkModules: false,
      chunkOrigins: false,
      colors: true,
      depth: false,
      entrypoints: false,
      errors: true,
      errorDetails: false,
      hash: false,
      maxModules: 0,
      modules: false,
      performance: false,
      providedExports: false,
      publicPath: false,
      reasons: false,
      source: false,
      timings: false,
      usedExports: false,
      version: false,
      warnings: false
    },
  },
  node: {
    // workaround for webpack-dev-server issue 
    // https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
    fs: 'empty',
    net: 'empty'
  }
};
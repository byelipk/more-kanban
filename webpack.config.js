const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

// NOTE
// For more info on Webpack config files see:
// https://webpack.js.org/configuration/

module.exports = {
  context: __dirname,
  entry: {
    app: './kanban_client/js/app.jsx'
  },
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, './priv/static/'),
    filename: 'js/[name].bundle.js',
    publicPath: '/priv/static/'
  },
  devServer: {
    publicPath: '/priv/static/',
    historyApiFallback: true
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  stats: {
    colors: true,
    reasons: true,
    chunks: true
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },

      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader',
          publicPath: '/priv/static/'
        })
      },

      // See: https://github.com/pcardune/handlebars-loader
      {
        test: /\.hbs$/,
        loader: "handlebars-loader"
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('css/[name].styles.css'),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': process.env.NODE_ENV
    }),

    // See: https://github.com/jaketrent/html-webpack-template
    new HtmlWebpackPlugin({
      template: './kanban_client/template.hbs',
      inject: false,
      filename: __dirname + '/lib/kanban_server_web/templates/layout/kanban.html.eex',
      title: 'Hello Kanban! 🤡'
    })
  ]
};

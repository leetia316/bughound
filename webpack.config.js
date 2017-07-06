var path = require('path')
// var webpack = require('webpack')

module.exports = {
  cache: false,
  entry: {
    app: __dirname + '/app/entry'
  },
  output: {
    path: path.resolve(__dirname, 'app', 'dist'),
    filename: '[name].js',
    chunkFilename: '[chunkhash].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader'
      },
      {
        test: /\.s[a|c]ss$/,
        loader: ['style-loader', 'css-loader', 'resolve-url-loader', 'sass-loader']
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      }
    ]
  },
  resolve: {
    alias: {
      '@img': __dirname + '/app/public/img'
    }
  },
  watch: true
}

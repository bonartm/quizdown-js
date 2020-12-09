const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      hash: false,
      template: './src/index.html',
      title: 'Development',
    }),
    new MiniCssExtractPlugin(),
  ],
  entry: path.resolve(__dirname, 'src/quizdown.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'quizdown.js',
    library: 'quizdown',
    libraryTarget: 'umd',
    libraryExport: 'default',
    globalObject: 'this'

  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8080
  },
  resolve: {
    alias: {
      svelte: path.resolve('node_modules', 'svelte')
    },
    extensions: ['.mjs', '.js', '.svelte'],
    mainFields: ['svelte', 'browser', 'module', 'main']
  },
  module: {
    rules: [
      {
        // removed html due to error with HtmlWebpackPlugin
        // test: /\.(html|svelte)$/,
        test: /\.(svelte)$/,
        exclude: /node_modules/,
        use: {
          loader: 'svelte-loader',
          options: {
            // does not work with webpack 5.0: https://github.com/sveltejs/svelte-loader/pull/136
            emitCss: false,
          },
        }
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ]
  }
};


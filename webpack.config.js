const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // Import the plugin

module.exports = {
  mode: 'development', 
  entry:{
    index: "./src/js/index.js",
    auth: "./src/js/auth.js",
  },
  output: {
    filename: '[name].bundle.js', 
    path: path.resolve(__dirname, 'dist'), 
    clean: true, 
  },
  module: {
    rules: [
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'], 
        },
      {
        test: /\.js$/, 
        exclude: /node_modules/, 
        use: {
          loader: 'babel-loader', 
          options: {
            presets: ['@babel/preset-env'], 
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js'], 
  },
  devtool: 'source-map', 
  devServer: {
    static: path.join(__dirname, 'dist'), 
    compress: true, 
    port: 5500, 
  },
  performance: {
    hints: false,
    maxAssetSize: 512000,
    maxEntrypointSize: 512000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html', 
      template: './src/templates/index.html', 
      chunks: ['index'], 
    }),
    new HtmlWebpackPlugin({
      filename: 'signIn.html',
      template: './src/templates/signIn.html', 
      chunks: ['auth'], 
    }),
    new HtmlWebpackPlugin({
      filename: 'signUp.html',
      template: './src/templates/signUp.html', 
      chunks: ['auth'], 
    }),
  ],
};

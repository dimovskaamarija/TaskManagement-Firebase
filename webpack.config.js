const path = require('path');

module.exports = {
  mode: 'development', // Change to 'production' for production builds
  entry: './src/index.js', // Entry point for your application
  output: {
    filename: 'bundle.js', // Output filename for the bundled code
    path: path.resolve(__dirname, 'dist'), // Output directory
    clean: true, // Clean the output directory before each build
  },
  module: {
    rules: [
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'], // Add these loaders
        },
      {
        test: /\.js$/, // Apply this rule to .js files
        exclude: /node_modules/, // Exclude the node_modules directory
        use: {
          loader: 'babel-loader', // Use Babel to transpile JS
          options: {
            presets: ['@babel/preset-env'], // Use the preset for modern JavaScript
          },
        },
      },
      {
        test: /\.css$/, // Apply this rule to .css files
        use: ['style-loader', 'css-loader'], // Use style-loader and css-loader
      },
    ],
  },
  resolve: {
    extensions: ['.js'], // Resolve these extensions
  },
  devtool: 'source-map', // Generate source maps for easier debugging
  devServer: {
    static: path.join(__dirname, 'dist'), // Serve files from the dist directory
    compress: true, // Enable gzip compression for everything served
    port: 5500, // Port number for the dev server
  },
  performance: {
    hints: false,
    maxAssetSize: 512000,
    maxEntrypointSize: 512000,
  },
};

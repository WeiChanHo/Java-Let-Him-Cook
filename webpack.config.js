const path = require('path');

module.exports = {
  entry: './src/main/frontend/src/index.js',
  output: {
    path: path.resolve(__dirname, 'src/main/resources/static/dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
    ],
  },
  mode: process.env.NODE_ENV || 'development',
  devServer: {
    static: path.join(__dirname, 'src/main/resources/static'),
    port: 3000,
    proxy: { '/api': 'http://localhost:8080' },
  },
};

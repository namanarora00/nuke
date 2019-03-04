const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const { resolve } = require("path");

const outputDirectory = "dist";

module.exports = {
  entry: ["babel-polyfill", "./src/client/index.js"],
  output: {
    path: path.join(__dirname, outputDirectory),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: "url-loader?limit=100000"
      }
    ]
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"]
  },
  devServer: {
    port: 3000,
    open: true,
    proxy: {
      "/": "http://localhost:8000/"
    }
  },
  plugins: [
    new CleanWebpackPlugin([outputDirectory]),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, "./public", "index.html"),
      filename: "./index.html"
    })
  ]
};

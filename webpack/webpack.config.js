const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');//公共或第三方代码单独打包到一个文件中CommonsChunkPlugin是内置的不需要安装
const AssetsPlugin = require('assets-webpack-plugin')
var assetsPluginInstance = new AssetsPlugin()

module.exports = {
  entry: {
    index: './src/js/index.js',
    loading: './src/js/loading.js',
    test: './src/js/test.js',
    vendors:['vue'] //抽成公用的可以减少重复打包，当你是多个入库页面时就能体会到其作用
  },

  output: {
  	path: path.resolve(__dirname, 'dist'),
  	filename: './js/[name].js?[hash]',
    chunkFilename: "[id].[hash].bundle.js"
  },

  module:{
    rules: [
      // {
      //   enforce: "pre",
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   loader: "eslint-loader",
      //   options: {
        	
      //   }
      // },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },

      // {
      //   test: /\.html$/,
      //   use: [
      //     {
      //       loader: 'html-loader',
      //       options: {
      //         attrs: ['img:src', 'link:href']
      //       }
      //     }
      //   ]
      // },
      {
        test: /\.html$/,
        loader: "html-loader?attrs=img:src img:data-src",
        query: {
            minimize: false
        }
      },

      // {
      //   test: /\.(less|css)$/,
      //   use: ['style-loader', 'css-loader', 'less-loader', 'postcss-loader']
      // },
      {
          test: /\.(less|css)$/,
          use: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use:[
                  'css-loader','postcss-loader','less-loader'
              ]
          })
      },

      {
        test: /favicon\.png$/,

        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]?[hash]'
            }
          }
        ]
      },

      // {
      //   test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
      //   exclude: /favicon\.png$/,
      //   use: [
      //     {
      //       loader: 'url-loader',
      //       options: {
      //         limit: 1
      //       }
      //     }
      //   ]
      // }
      {
        test: /\.(png|gif|jpg|jpeg)$/,
         loader: 'url-loader',
         query: {
             /*
              *  limit=10000 ： 10kb
              *  图片大小小于10kb 采用内联的形式，否则输出图片
              * */
             limit: 10000,
             name: '[name]-[hash:8].[ext]'
             // name: '../img/[name]-[hash:8].[ext]'
         }

     },


    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: './index.html',
      template: './index.html',
      chunks:['','index']
    }),
    new HtmlWebpackPlugin({
      filename: './loading.html',
      template: './loading.html',
      chunks:['','loading']
    }),
    new HtmlWebpackPlugin({
      filename: './test.html',
      template: './test.html',
      chunks:['','test']
    }),
    new ExtractTextPlugin("./css/[name].css?[hash:8]"),

    new CommonsChunkPlugin({//公用文件打包到下面的文件
      name: "vendor",
      filename: "./js/vendor.bundle.js"
    }),

    new AssetsPlugin({filename: 'assets.json'}),
  ],

  devServer: {
    port: 5480,
    hot: true,
    historyApiFallback: true
  },

  performance: {
    hints: false
  }

}
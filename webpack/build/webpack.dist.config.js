var webpack = require('webpack');
var webpackConfig = require('./webpack.base.config.js');

webpackConfig.plugins.push(
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
    })
);

module.exports = webpackConfig;
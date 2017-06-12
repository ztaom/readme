var webpack = require('webpack');
var webpackConfig = require('../webpack.config.js');

webpackConfig.plugins.push(
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('base')
    })
);

module.exports = webpackConfig;
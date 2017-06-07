var webpack = require('webpack');
var webpackConfig = require('../webpack.config.js');

webpackConfig.devtool = 'source-map';

webpackConfig.plugins.push(
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development')
    })
);

module.exports = webpackConfig;
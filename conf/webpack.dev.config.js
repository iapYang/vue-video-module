const merge = require('webpack-merge');
const webpack = require('webpack');

const baseWebpackConfig = require('./webpack.base.config.js');

module.exports = merge(baseWebpackConfig, {
    devtool: 'eval-source-map',
    devServer: {
        contentBase: './dev',
        host: 'localhost',
        open: true,
        hot: true,
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ],
});

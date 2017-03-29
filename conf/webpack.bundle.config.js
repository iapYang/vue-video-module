const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const merge = require('webpack-merge');

const baseWebpackConfig = require('./webpack.base.config.js');

module.exports = merge(baseWebpackConfig, {
    entry: path.resolve(__dirname, '../dev/component/src/index.js'),
    output: {
        path: path.join(process.cwd(), 'bundle'),
        filename: 'index.js',
        libraryTarget: 'umd',
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false,
                drop_console: true,
            },
        }),
    ],
});

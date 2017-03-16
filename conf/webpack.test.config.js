const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');

const baseWebpackConfig = require('./webpack.base.config.js');

module.exports = merge(baseWebpackConfig, {
    entry: path.resolve(__dirname, '../example/script/index.js'),
    output: {
        path: path.join(process.cwd(), 'example'),
        filename: 'index.js',
    },
    devtool: 'eval-source-map',
    devServer: {
        contentBase: './example',
        host: '0.0.0.0',
        open: true,
        hot: true,
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ],
});

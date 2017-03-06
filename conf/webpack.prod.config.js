const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const baseWebpackConfig = require('./webpack.base.config.js');

const htmlFiles = glob.sync('./dev/*.html');
const htmlPlugins = htmlFiles.map((file, i) =>
    new HtmlWebpackPlugin({
        filename: path.basename(file),
        template: file,
        inject: false,
        minify:{
            removeComments: true,
            collapseWhitespace: true,
        },
    }));

module.exports = merge(baseWebpackConfig, {
    plugins: [
        ...htmlPlugins,
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false,
                drop_console: true,
            },
        }),
        new CopyWebpackPlugin([
            {
                from: './dev',
            },
        ], {
            ignore: [
                '*.html',
                'router.js',
                'style/**/*',
                'script/**/*',
                'store/**/*',
                'component/**/*',
                'data/**/*',
                'font/**/*',
            ],
        }),
    ],
});

const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const paths = require('../../utilities/paths').config;

const extractLiquidStyles = new ExtractTextPlugin(
    '[name].styleLiquid.scss.liquid',
);

const core = {
    context: paths.theme.root,

    output: {
        filename: '[name].js',
        path: paths.theme.dist.assets
    },

    entry: Object.assign(
        {},
        paths.liquidLayouts,
        paths.liquidTemplates,
    ),
    resolveLoader: {
        modules: [
            path.resolve(__dirname, '../../../node_modules'),
            path.resolve(__dirname, '../../'),
            path.resolve(paths.theme.root, 'node_modules'),
            paths.theme.root
        ],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: paths.commonExcludes,
                loader: path.resolve(__dirname, '../hmr-alamo-loader.js'),
            },
            {
                test: /fonts\/.*\.(eot|svg|ttf|woff|woff2|otf)$/,
                exclude: /node_modules/,
                loader: 'file-loader',
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                exclude: paths.commonExcludes,
                use: [
                    {loader: 'file-loader', options: {name: '[name].[ext]'}},
                    {loader: 'img-loader'},
                ],
            },
            {
                test: /\.(liquid|json)$/,
                exclude: [
                    /(css|scss|sass)\.liquid$/,
                    ...paths.commonExcludes,
                ],
                loader: 'file-loader',
                options: {
                    name: '../[path][name].[ext]',
                },
            },
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
            {
                test: /(css|scss|sass)\.liquid$/,
                exclude: paths.commonExcludes,
                use: extractLiquidStyles.extract(['concat-style-loader']),
            },
        ],
    },

    plugins: [

        new CleanWebpackPlugin({

        }),

        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),

        extractLiquidStyles,

        new CopyWebpackPlugin([
            {
                from: paths.theme.src.assets,
                to: paths.theme.dist.assets,
                flatten: true,
            },
            {
                from: paths.theme.src.layout,
                to: paths.theme.dist.layout,
            },
            {
                from: paths.theme.src.config,
                to: paths.theme.dist.config,
            },
            {
                from: paths.theme.src.locales,
                to: paths.theme.dist.locales,
            },
            {
                from: paths.theme.src.snippets,
                to: paths.theme.dist.snippets,
            },
            {
                from: paths.theme.src.templates,
                to: paths.theme.dist.templates,
            },
            {
                from: paths.theme.src.sections,
                to: paths.theme.dist.sections,
            },
        ]),
    ],
}

module.exports = core;
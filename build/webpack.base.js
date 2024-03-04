const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isDev = process.env.NODE_ENV === 'development'; // 是否是开发模式

module.exports = {
    entry: path.join(__dirname, '../src/index.tsx'), //入口文件
    //打包文件出口
    output: {
        filename: 'static/js/[name].[chunkhash:8].js', //每个输出的js文件的名称.加上[chunkhash:8]
        path: path.join(__dirname, '../dist'), //打包结果输出的路径
        clean: true, //webpack5内置的，webpack4中需要配置clean-webpack-plugin来删除之前的dist
        publicPath: '/' //打包后文件的公共前缀路径
    },
    module: {
        rules: [
            {
                include: [path.resolve(__dirname, '../src')],
                test: /.(ts|tsx)$/, //匹配ts、tsx文件
                use: ['thread-loader', 'babel-loader']
            },
            {
                test: /.css$/, //匹配所有的 css 文件
                include: [path.resolve(__dirname, '../src')],
                use: [
                    isDev ? 'style-loader' : MiniCssExtractPlugin.loader, // 开发环境使用style-looader,打包模式抽离css
                    'css-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /.less$/, //匹配所有的 less 文件
                include: [path.resolve(__dirname, '../src')],
                use: [
                    isDev ? 'style-loader' : MiniCssExtractPlugin.loader, // 开发环境使用style-looader,打包模式抽离css
                    'css-loader',
                    'postcss-loader',
                    'less-loader'
                ]
            },
            {
                include: [path.resolve(__dirname, '../src')],
                test: /.(png|jpg|jpeg|gif|svg)$/, // 匹配图片文件
                type: 'asset', // type选择asset
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024 // 小于10kb转base64位
                    }
                },
                generator: {
                    filename: 'static/images/[name].[contenthash:8][ext]' // 文件输出目录和命名
                }
            },
            {
                include: [path.resolve(__dirname, '../src')],
                test: /.(woff2?|eot|ttf|otf)$/, // 匹配字体图标文件
                type: 'asset', // type选择asset
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024 // 小于10kb转base64位
                    }
                },
                generator: {
                    filename: 'static/fonts/[name].[contenthash:8][ext]' // 文件输出目录和命名
                }
            },
            {
                include: [path.resolve(__dirname, '../src')],
                test: /.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // 匹配媒体文件
                type: 'asset', // type选择asset
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024 // 小于10kb转base64位
                    }
                },
                generator: {
                    filename: 'static/media/[name].[contenthash:8][ext]' // 文件输出目录和命名
                }
            }
        ]
    },
    resolve: {
        modules: [path.resolve(__dirname, '../node_modules')], // 查找第三方模块只在本项目的node_modules中查找
        extensions: ['.js', '.tsx', '.ts'],
        alias: {
            '@': path.join(__dirname, '../src')
        }
    },
    cache: {
        type: 'filesystem' // 使用文件缓存
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html'), //模板用定义root节点的模板
            inject: true //自动注入静态资源
        }),
        // 配置环境变量
        new webpack.DefinePlugin({
            'process.env.BASE_ENV': JSON.stringify(process.env.BASE_ENV)
        })
    ]
};

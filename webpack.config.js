const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Режимы сборки
const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;

// Автоматизация filename, чтобы [hash] к названию добавлялось только на production
const filename = ext => isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`;

const jsLoaders = () => {
    const loaders = [
        {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env']
            }
        }
    ];

    if(isDev) {
        loaders.push('eslint-loader');
    }

    return loaders;
};

module.exports = {
    // Отвечает за то, где лежат все исходники приложения
    // __dirname - абсолютный путь до корневой папки
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    // Входные точки для приложения. Благодаря context, текущее положение - папка src
    entry: ['@babel/polyfill', './index.js'],
    // Выходные точки
    output: {
        // [hash] нужно потому что, если постоянно обновлять файл только как bundle.js, то иногда браузер может не скачать у пользователя новые файлы и он не увидит изменений
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.js'],
        // Заменяем альтернативные пути типа "../../ на @"
        // import ../../../core/Component --> import @core/Component
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@core': path.resolve(__dirname, 'src/core')
        }
    },
    devtool: isDev ? 'source-map' : false,
    devServer: {
        port: 3000,
        hot: isDev
    },
    plugins: [
        // Чистит папку dist
        new CleanWebpackPlugin(),
        // Работает с HTML
        new HTMLWebpackPlugin({
            // Шаблон html
            template: 'index.html',
            // Минификация
            minify: {
                removeComments: isProd,
                collapseWhitespace: isProd
            }
        }),
        // Плагин нужен для того, чтобы переносить favicon
        new CopyPlugin({
            patterns: [
                {
                  from: path.resolve(__dirname, 'src/favicon.ico'),
                  to: path.resolve(__dirname, 'dist')
                }
            ]
        }),
        // Собирает css в один файл
        new MiniCssExtractPlugin({
            filename: filename('css')
        })
    ],
    module: {
        rules: [
            {
                // Тестирует расширения, либо sass, либо scss
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: isDev,
                            reloadAll: true
                        }
                    },
                    'css-loader',
                    // Используем autoprefixer
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    require('autoprefixer')
                                ]
                            }
                        }
                    },
                    'sass-loader'
                ]
            },
            // Работа с babel
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: jsLoaders()
            }
        ]
    }
};
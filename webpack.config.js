const path = require('path');

module.exports = {
    // Отвечает за то, где лежат все исходники приложения
    // __dirname - абсолютный путь до корневой папки
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    // Входные точки для приложения. Благодаря context, текущее положение - папка src
    entry: './index.js',
    // Выходные точки
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
};
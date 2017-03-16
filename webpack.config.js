var hwp = require('html-webpack-plugin');

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'dist/app.js'
    },
    module: {
        loaders: [
            {test: /\.less$/, loader: 'style-loader!less-loader'},
            {test: /\.css$/, loader: "style-loader!css-loader!autoprefixer-loader"},
            {test: /\.(jpg|png|ttf|ico)$/, loader: 'url-loader?limit=6000000'},
            {test: /\.vue$/, exclude: /node_modules/, loader: 'vue-loader'},
            {test: /\.json$/, exclude: /node_modules/, loader: 'json-loader'},
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader?presets[]=es2015'
            }
        ]
    },
    plugins: [new hwp({
        filename: 'index.html',
        template: 'index.html'
    })]
};

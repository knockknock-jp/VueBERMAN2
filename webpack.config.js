const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
module.exports = {
    mode: (process.env.NODE_ENV !== 'production') ? 'development' : 'production',
    entry: {
        'main': './src/index.js',
        'test': './src/test.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: (process.env.NODE_ENV !== 'production') ? '[name].js' : '[name].min.js',
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        port: 3000,
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader']
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(jpg|png|gif|svg)$/i,
                loader: 'url-loader',
            },
            // {
            //     test: /\.(jpg|png|gif|svg)$/i,
            //     loader: 'file-loader',
            //     options: {
            //         outputPath: '../images',
            //         name: '[name].[ext]',
            //     },
            // },
        ]
    },
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            vue$: 'vue/dist/vue.esm.js',
        },
    },
    plugins: [
        new VueLoaderPlugin()
    ]
};

if (process.env.NODE_ENV !== 'production') {
    module.exports.devtool = 'inline-source-map';
}

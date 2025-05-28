const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        filename: 'widget.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'ChuzedayWidget',
        libraryTarget: 'umd',
        globalObject: 'this',
    },
    plugins: [
        new MiniCssExtractPlugin({
          filename: 'widget.css'
        }),
      ],
    module: {
    rules: [
        {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
            options: {
            presets: [
                ['@babel/preset-env', { targets: 'defaults' }],
                ['@babel/preset-react', { runtime: 'automatic' }]
            ]
            }
        }
        },
        {
            test: /\.(jpe?g|gif|png|svg)$/i,
            type: 'asset',
            parser: {
                dataUrlCondition: {
                maxSize: 10 * 1024,
                },
            },
            generator: {
                filename: 'images/[name][ext]',
            },
        },
        {
            test: /\.css$/i,
            use: [MiniCssExtractPlugin.loader, 'css-loader'],
            include: [
              path.resolve(__dirname, 'src'),
              path.resolve(__dirname, 'node_modules/bootstrap') // include bootstrap
            ]
          }
    ]
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    }
};

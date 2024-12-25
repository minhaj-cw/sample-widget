const path = require('path');

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
            { // Image loader rule (using Webpack 5 asset module)
                test: /\.(jpe?g|gif|png|svg)$/i,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024, // Convert images < 10kb to base64 strings
                    },
                },
                generator: {
                    filename: 'images/[name][ext]',
                },
            },
            { // CSS loader rule for Bootstrap
                test: /\.css$/,
                use: [
                    'style-loader', // Injects CSS into the DOM
                    'css-loader',   // Resolves CSS imports and URLs
                ],
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    }
};

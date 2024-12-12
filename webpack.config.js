const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/index.js', // Replace 'src/Widget.jsx' with the actual path to your component
    output: {
        filename: 'widget.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            }
        ]
    }
};
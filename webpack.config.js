const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        filename: 'widget.js',
        path: path.resolve(__dirname, 'dist'),
        // Important for libraries/widgets:
        library: 'ChuzedayWidget', 
        libraryTarget: 'umd', // Universal Module Definition (works in browsers and Node.js)
        globalObject: 'this', // Important for UMD builds in browser and node
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
                            ['@babel/preset-env', { targets: "defaults" }], // or specify browser targets
                            ['@babel/preset-react', { runtime: 'automatic' }] // This is the key change!
                        ]
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    }
};
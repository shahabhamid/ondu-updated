const path = require('path');

module.exports = {
    mode: "production",
    target: 'node', // Set target to 'node' for Node.js environment
    entry: './index.js', // Entry point of your server code
    output: {
        filename: 'bundle.js', // Output filename as 'server.js'
        path: path.resolve(__dirname, 'dist'), // Output directory
    },
    resolve: {
        extensions: ['.js'], // File extensions to resolve
    },
    // Add any loaders or plugins you need for your server code here
    module: {
        rules: [
            // Example rule for transpiling JavaScript files using Babel
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.html$/,
                use: 'html-loader',
            },
        ],
    },
    // Add any plugins you need for your server code here
    plugins: [
        // Example plugin for defining environment variables
        // new webpack.DefinePlugin({
        //   'process.env.NODE_ENV': JSON.stringify('production'),
        // }),
    ],
    // externals: [
    //     {
    //         'nock': 'commonjs2 nock',
    //         'mock-aws-s3': 'commonjs2 mock-aws-s3'
    //     }
    // ],
    externals: ['nock', 'mock-aws-s3', 'aws-sdk']
};

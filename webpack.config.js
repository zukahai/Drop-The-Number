const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    mode: "development",
    devtool: 'inline-source-map',
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "dist"),
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 3000,
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "assets/images", to: "images" },
            ],
        }),
    ],
};
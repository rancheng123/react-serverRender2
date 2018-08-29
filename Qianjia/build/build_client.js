const webpack = require("webpack");
const config = require('./webpack.config');
const compiler = webpack(config);

console.log(' webpack --编译开始')
compiler.run((err, stats) => {
    if (err) {
        console.error(err.stack || err);
        if (err.details) {
            console.error(err.details);
        }
        return;
    }

    console.log(stats.toString({
        // ...
        // Add console colors
        chunks: false,
        colors: true
    }))

    console.log(' webpack --编译结束')





});
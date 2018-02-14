const path = require('path');

module.exports = {
    entry: './www/js/viewer.js',
    output: {
        filename: 'mgv.bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: 'inline-source-map'
};

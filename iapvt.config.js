const path = require('path');

module.exports = {
    bundle: {
        path: path.resolve(__dirname, './dev/component/src/VueVideo.vue'),
        name: 'VueVideo',
    },
    rules: [{
        test: /\.(jpg|jpeg|png|gif|svg)$/,
        use: [{
            loader: 'url-loader',
            options: {
                limit: 10240,
                name: 'static/[name].[ext]',
            },
        }],
    }],
};

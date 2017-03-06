module.exports = {
    plugins: [
        require('postcss-cssnext')({
            warnForDuplicates: false,
            features: {
                calc: false,
            },
        }),
    ],
};

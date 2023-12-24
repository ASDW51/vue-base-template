module.exports = {
    plugins: {
        'postcss-pxtorem': {
            rootValue: 37.5, //结果为：设计稿元素尺寸/75，比如元素宽750px,最终页面会换算成 10rem（按750宽设计稿配置）
            propList: ['*'],

            exclude: /node_modules/i,

        },
        // 'autoprefixer': {browsers: ['Android >= 5.0', 'iOS >= 8']}
    },

};
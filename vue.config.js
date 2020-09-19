module.exports = {
    /* devServer: {
        overlay: {
            warnings: false,
            errors: false
        }
    },
    lintOnSave: false */
    chainWebpack: config => {
        config.when(process.env.NODE_ENV === 'production', config => {
            config.entry('app').clear().add('./src/main-prod.js')
            config.set('externals', {
                lodash: '_',
                vue: 'Vue',
                'vue-router': 'VueRouter',
                axios: 'axios',
                echarts: 'echarts',
                nprogress: 'NProgress',
                'vue-quill-editor': 'VueQuillEditor'
            })
            config.plugin('html').tap(args => {
                args[0].isProd = true
                return args
            })
        })
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.js')
            config.plugin('html').tap(args => {
                args[0].isProd = false
                return args
            })
        })
    },
    css: {
        extract: false
    },
};

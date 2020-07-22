'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'vue Admin Template' // page title
const port = 9528 // dev port
const isDev = process.env.NODE_ENV === 'development'

// All configuration item explanations can be find in //cli.vuejs.org/config/
module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: isDev,
  productionSourceMap: isDev,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      // change xxx-api/login => mock/login
      // detail: //cli.vuejs.org/config/#devserver-proxy
      [process.env.VUE_APP_BASE_API]: {
        target: `http://localhost:${port}/mock`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    },
    after: require('./mock/mock-server.js')
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src'),
        'vue$': 'vue/dist/vue.esm.js'
      }
    },
    externals: {
      'vue': 'Vue',
      'element-ui': 'ELEMENT',
      'vue-router': 'VueRouter',
      'vuex': 'Vuex',
      'js-cookie': 'Cookies',
      'nprogress': 'NProgress',
      'axios': 'axios'
    },
    output: {
      filename: 'jrender-admin.js',
      chunkFilename: 'jrender-admin.js'
    }
  },
  chainWebpack(config) {
    const cdn = {
      css: [
        '//unpkg.com/element-ui@2.13.2/lib/theme-chalk/index.css',
        '//unpkg.com/nprogress@0.2.0/nprogress.css',
        '//unpkg.com/normalize.css@7.0.0/normalize.css'
      ],
      js: [
        '//unpkg.com/vue@2.6.10/dist/vue.js',
        '//unpkg.com/element-ui@2.13.2/lib/index.js',
        '//unpkg.com/element-ui@2.13.2/lib/umd/locale/zh-CN.js',
        '//unpkg.com/element-ui@2.13.2/lib/umd/locale/en.js',
        '//unpkg.com/vue-router@3.3.4/dist/vue-router.js',
        '//unpkg.com/vuex@3.5.1/dist/vuex.js',
        '//unpkg.com/js-cookie@2.2.1/src/js.cookie.js',
        '//unpkg.com/nprogress@0.2.0/nprogress.js',
        '//unpkg.com/axios@0.18.1/dist/axios.js'
      ]
    }
    config.plugin('html')
      .tap(args => {
        args[0].cdn = cdn
        return args
      })
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test
    config.optimization.delete('splitChunks')

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-jrender-admin'
      })
      .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
      .when(isDev,
        config => config.devtool('cheap-source-map')
      )

    config
      .when(!isDev,
        config => {
          // config
          //   .plugin('ScriptExtHtmlWebpackPlugin')
          //   .after('html')
          //   .use('script-ext-html-webpack-plugin', [{
          //   // `runtime` must same as runtimeChunk name. default is `runtime`
          //     inline: /runtime\..*\.js$/
          //   }])
          //   .end()
          // config
          //   .optimization.splitChunks({
          //     chunks: 'all',
          //     cacheGroups: {
          //       libs: {
          //         name: 'chunk-libs',
          //         test: /[\\/]node_modules[\\/]/,
          //         priority: 10,
          //         chunks: 'initial' // only package third parties that are initially dependent
          //       },
          //       commons: {
          //         name: 'chunk-commons',
          //         test: resolve('src/components'), // can customize your rules
          //         minChunks: 3, //  minimum common number
          //         priority: 5,
          //         reuseExistingChunk: true
          //       }
          //     }
          //   })
          // config.optimization.runtimeChunk('single')
        }
      )

    if (config.plugins.has('extract-css')) {
      const extractCSSPlugin = config.plugin('extract-css')
      extractCSSPlugin && extractCSSPlugin.tap(() => [{
        filename: 'jrender-admin.css',
        chunkFilename: 'jrender-admin.css'
      }])
    }
  }
}

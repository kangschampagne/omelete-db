import Tapable from 'tapable'
import $ from 'jquery'
import Defer from './defer.js'
import cache from './cache.js'

class Core extends Tapable {
  constructor(options) {
    super()
    // merge outside options and tapable defaultOptions
    this.options = $.extend({}, options || {}, this.constructor.defaultOptions)
    // 注册缓存插件
    cache(this)
  }
  // ?? 这个defer 哪里传入？
  ajax(options, defer) {
    defer = defer || new Defer
    // 合并所有 options
    const opts = this.applyPluginsWaterfall('options', $.extend({}, this.options, options))
    // 注册 endpoint 插件 如果有一个插件可以执行 则立即执行
    const endpoint = this.applyPluginsBailResult('endpoint', opts, defer)()
      .then(success => {
        // console.log('success', success)
        // resolve plugin
        this.applyPlugins('resolve', success, opts, defer)
      }, error => {
        // console.log('error', error)
      })

    return defer
  }

  get(data = {}, options = {}) {
    options.method = 'GET'
    options.data = data
    return this.ajax(options)
  }

  post() {}

  jsonp() {}
}

module.exports = Core
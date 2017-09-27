import Tapable from 'tapable'
import $ from 'jquery'
import Defer from './defer.js'
import cache from './cache.js'
import Catch from './catch.js'

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
    console.log('opts', opts)
    // 注册 endpoint 插件 如果有一个插件可以执行 则立即执行
    const endpoint = this.applyPluginsBailResult('endpoint', opts, defer)(opts)
      .then(
        Catch(success => {
          console.log('success', success)
          // 注册 judge 插件， 返回值为 Boolean??
          const flag = this.applyPluginsBailResult('judge', success, opts)
          if (flag === false) {
            // 注册 fail 插件
            success = this.applyPluginsWaterfall('error', success, opts)
            defer.reject(success)
          }
          // resolve plugin
          this.applyPlugins('resolve', success, opts, defer)
        }, defer, opts),
        error => {
          console.log('error', error)
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
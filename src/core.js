import Tapable from 'tapable'
import $ from 'jquery'
import Defer from './defer.js'

class Core extends Tapable {
  constructor(options) {
    super()
    // merge outside options and tapable defaultOptions
    this.options = $.extend({}, options || {}, this.constructor.defaultOptions)
  }
  
  ajax(options, defer) {
    defer = defer || new Defer
    const opts = this.applyPluginsWaterfall('options', $.extend({}, this.options, options))
    const endpoint = this.applyPluginsBailResult('endpoint', opts, defer)()
      .then(success => {
        console.log('success', success)
      }, error => {
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
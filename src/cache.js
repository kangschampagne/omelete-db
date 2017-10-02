import defer from './defer.js'
import storage from './storage.js'
import $ from 'jquery'

function parseData(data) {
  if (!data) return ''
  return Object.keys(data)
    .filter(v => v.charAt(0) !== '_')
    .sort()
    .reduce((res, cur) => {
      res.push(`${cur}=${data[cur]}`)
      return res
    }, [])
    .join('&')
}

function parseKey(options) {
  const key = options.__key__ || `${options.url}?${parseData(options.data)}`
  options.__key__ = key
  return key
}

function hasCache(options) {
  // 判断 nocache 是否有值， 有值返回 false
  if (options.nocache === true || options.nocache === 'again') return false
  const key = storage.has(parseKey(options), options.level)
  return key
}

function fromCache(defer, options) {
  const res = storage.get(options.hasCache)
  // 从 cache 中 获取的数据 设置 __flag__: 'CACHE'
  const p = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (res) {
        resolve($.extend({
          __flag__: 'CACHE'
        }, res))
      }
    }, 0)
  })

  this.ajax($.extend({}, options, {
    nocache: 'again',
    hasCache: false
  }), defer)

  return p
}

module.exports = instance => {
  // localstorage
  if (storage.compat()) {
    storage.init()
    // 初始化了 localstorage

    instance.plugin('options', (options) => {
      // 判断在localStrage 中是否有 数据对应的 key
      options.hasCache = hasCache(options)
      return options
    })

    instance.plugin('endpoint', (options, defer) => {
      if (options.hasCache) {
        // 如果判断有缓存，则做获取操作
        return fromCache.bind(instance, defer)
      }
    })

    instance.plugin('resolve', (res, opts, defer) => {
      // if use cache, 如果 没有禁止使用缓存 或者 第二次缓存请求， 且 没有 flag 标志
      if ((!opts.nocache || opts.nocache === 'again') && !res.__flag__) {
        // 执行save to localstorage 操作
        // 传参 key, value, level
        console.log('storage.save')
        storage.save(parseKey(opts), res, opts.level)
      }

      // if no use cache
      if (opts.nocache === 'again') {
        // nocache = 'again'
      } else {
        try {
          console.log('resolve', res.__flag__)
          defer.resolve(res, res.__flag__)
        } catch (e) {
          // 输出测试 指定错误格式 => 'DB(ppp://321) xxxx is not defined'
          e.message = `DB(${opts.url}) ${e.message}`
          throw e
        }
      }
    })
  }
}
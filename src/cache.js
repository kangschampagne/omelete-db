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
  // 如果 localStorage 中存在 key， 且 有 lazy状态和refresh 更新时间
  if (key && options.lazy && options.refresh) {
    // 取出 缓存中 其 储存的时间点
    const lastTime = +key.slice(key.length - 13)
    // 如果 更新时间长度 小于 其缓存到现在的时间长度
    if (options.refresh < (+new Date - lastTime)) { 
      // 返回 没有缓存
      console.log('数据过期')
      return false
    }
  }
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
  
  // 如果 有 refresh 时间，且不是 lazy 的状态
  if (options.refresh && !options.lazy) {
    const hasCache = options.hasCache
    // 取出 缓存中 其 储存的时间点
    const lastTime = +hasCache.slice(hasCache.length - 13)
    // 如果 更新时间长度 大于 其缓存到现在的时间长度
    if (options.refresh > (+new Date - lastTime)) {
      // 不再请求一次，直接返回 p
      console.log('未过期', options)
      return p
    }
  }

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
      // 如果有lazy状态，可以设置 过期请求时间，默认是一天
      if(options.lazy && !options.refresh) {
        options.refresh = 86400000
      }
      return options
    })

    instance.plugin('endpoint', (options, defer) => {
      if (options.hasCache) {
        // 如果判断有缓存，则做获取操作
        return fromCache.bind(instance, defer)
      }
      // 无论 是否可以 在缓存中取到值， 计算请求开始的时间点
      options.__start__ = +new Date
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
      if (opts.nocache === 'again' && opts.lazy) {
        console.log('lazy', res)
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
import defer from './defer.js'

module.exports = instance => {
  instance.plugin('resolve', (res, opts, defer) => {
    // if no use cache
    if (opts.nocache === true || opts.nocache === undefined) {
      try {
        defer.resolve(res)
      } catch (e) {
        // 输出测试 指定错误格式 => 'DB(ppp://321) xxxx is not defined'
        e.message = `DB(${opts.url}) ${e.message}`
        throw e
      }
    } else if (opts.nocache === false) {
      // 有缓存的情况
    }
  })
}
const formatName = (opts) => {
  let name = `DB(${opts.url})`
  if (typeof opts._inject_ === 'object') {
    name = `Component(${opts._inject_.name}@${opts._inject_.version}).` + name
  }
  return name
}

module.exports = (fn, defer, opts) => {
  return (arg) => {
    // 捕获 请求完成时 处理的错误
    try {
      fn(arg)
    } catch (err) {
      // err error
      const tmp = window['console']
      if (defer.catchCallback.length === 0 && tmp && tmp.warn) {
        tmp.warn(`${formatName(opts)} may have some error, please use catch method to catch error`)
        tmp.warn(err.toString())
      }
      defer.fire(defer.catchCallback, err)
    }
  }
}
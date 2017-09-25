
module.exports = (fn, defer, opts) => {
  return (arg) => {
    // 捕获 请求完成时 处理的错误
    try {
      fn(arg)
    } catch (err) {
      defer.fire(defer.catchCallback, err)
    }
  }
}
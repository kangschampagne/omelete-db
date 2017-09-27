const noop = function () {}

class Defer {
  constructor(...defers) {
    this.successCallback = []
    this.failCallback = []
    this.catchCallback = []
  }

  done(cb) {
    this.successCallback.push(cb)
    return this
  }

  fail(cb) {
    this.failCallback.push(cb)
    return this
  }

  catch(cb) {
    this.catchCallback.push(cb)
    return this
  }

  fire(cbs, res, flag) {
    for (let i = 0, len = cbs.length; i < len; i++) {
      // 执行 cb3
      cbs[i](res, flag)
    }
    return this
  }

  resolve(res, flag) {
    this.fire(this.successCallback, res, flag)
  }

  reject(res, flag) {
    if (window._ENV_ === 'dev') {
      throw new Error(`You need use fail method to get the error: ${JSON.stringify(res)}`)
    }
    this.fire(this.failCallback, res, flag)
  }
}

module.exports = Defer
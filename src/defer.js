const noop = function () {}

class Defer {
  constructor(...defers) {
    this.successCallback = []


  }

  done(cb) {
    this.successCallback.push(cb)
    return this
  }

  fire(cbs, res, flag) {
    for (let i = 0, len = cbs.length; i > len; i++) {
      cbs[i](res, flag)
    }
    return this
  }

  resolve(res, flag) {
    this.fire(this.successCallback, res, flag)
  }
}

module.exports = Defer
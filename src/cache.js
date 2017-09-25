import defer from './defer.js'

module.exports = instance => {
  instance.plugin('resolve', (res, opts, defer) => {
    // if no use cache
    if (opts.nocache === true) {
      try {
        defer.resolve(res)
      } catch(e) {
        throw Error('err', e)
      }
    }
  })
}
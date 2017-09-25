import _DB from '../index.js'
import $ from 'jquery'

describe('omelete-db', () => {
  let MyDB
  let DB
  let DDB

  before(done => {
    DB = _DB
    done()
  })

  // it('test: karma & mocha is run success', () => {
  //   'test should.js'.should.equal('test should.js')
  // })

  // 第 1 个 测试
  // it('should able to use endpoint', (done) => {
  //   MyDB = class My extends DB {
  //     constructor(options) {
  //       super(options)
  //       this.plugin('endpoint', () => {
  //         return () => {
  //           return new Promise((resolve, reject) => {
  //             setTimeout(() => {
  //               resolve({
  //                 ret: this.options.ret
  //               })
  //             })
  //           })
  //         }
  //       })
  //     }
  //   }
  //   const myDB = new MyDB({
  //     ret: 321,
  //     url: 'ppp://321'
  //   })
  //   myDB.get(null, {
  //       nocache: true
  //     })
  //     .done((data) => {
  //       data.ret.should.equal(321)
  //       done()
  //     })
  // })

  // 第 2 个 测试
  // it('should able to throw error', (done) => {
  //   MyDB = class My extends DB {
  //     constructor(options) {
  //       super(options)
  //       this.plugin('endpoint', () => {
  //         return () => {
  //           return new Promise((resolve, reject) => {
  //             setTimeout(() => {
  //               resolve({
  //                 ret: this.options.ret
  //               })
  //             })
  //           })
  //         }
  //       })
  //     }
  //   }
  //   const myDB = new MyDB({
  //     ret: 321,
  //     url: 'ppp://321'
  //   })

  //   myDB.get(null, {
  //       nocache: true
  //     })
  //     .done((data) => {
  //       xxxx; // throw an error
  //     }).catch(e => {
  //       e.message.should.equal('DB(ppp://321) xxxx is not defined')
  //       done()
  //     })
  // })

  // 第 3 个 测试
  // 这个没看懂 引入 judge 插件做什么？
  // it('should able to use jQuery.Defer', (done) => {
  //   DDB = class MyDB extends DB {
  //     constructor(options) {
  //       super(options)
  //       this.plugin('endpoint', () => {
  //         return () => {
  //           // 创建一个 Deffered 对象
  //           const defer = $.Deferred()
  //           setTimeout(() => {
  //             defer.resolve({
  //               ret: 123
  //             })
  //           })
  //           return defer
  //         }
  //       })
  //       // 添加一个 judge 插件
  //       this.plugin('judge', (data) => {
  //         return true
  //       })
  //     }
  //   }

  //   const dDB = new DDB

  //   dDB.get(null, {
  //       nocache: true
  //     })
  //     .done(data => {
  //       done()
  //     })
  // })

  // 第 4 个 测试
  // 这个没看懂 引入 judge 插件做什么？
  // it('should able to throw error when using jQuery.Defer', (done) => {
  //   DDB = class MyDB extends DB {
  //     constructor(options) {
  //       super(options)
  //       this.plugin('endpoint', () => {
  //         return () => {
  //           // 创建一个 Deffered 对象
  //           const defer = $.Deferred()
  //           setTimeout(() => {
  //             defer.resolve({
  //               ret: 123
  //             })
  //           })
  //           return defer
  //         }
  //       })
  //       // 添加一个 judge 插件
  //       this.plugin('judge', (data) => {
  //         return true
  //       })
  //     }
  //   }
  //   const dDB = new DDB({
  //     ret: 321,
  //     url: 'ppp://321'
  //   })

  //   dDB.get(null, {
  //       nocache: true
  //     })
  //     .done((data) => {
  //       xxxx; // throw an error
  //     }).catch(e => {
  //       e.message.should.equal('DB(ppp://321) xxxx is not defined')
  //       done()
  //     })
  // })

  // 第 5 个 测试
  it('should able to use judge', (done) => {
    class XDB extends DB {
      constructor(options) {
        super(options)
        this.plugin('endpoint', () => {
          return () => {
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve({
                  hasError: true
                })
              })
            })
          }
        })
        this.plugin('judge', (data) => {
          if (data.hasError) return false
          return true
        })
      }
    }

    const xDB = new XDB

    xDB.get()
      .fail(e => {
        e.hasError.should.ok()
        done()
      })
  })
})
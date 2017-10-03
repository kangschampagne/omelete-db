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
  it('should able to use endpoint', (done) => {
    MyDB = class My extends DB {
      constructor(options) {
        super(options)
        this.plugin('endpoint', () => {
          return () => {
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve({
                  ret: this.options.ret
                })
              })
            })
          }
        })
      }
    }
    const myDB = new MyDB({
      ret: 321,
      url: 'ppp://321'
    })
    myDB.get(null, {
        nocache: true
      })
      .done((data) => {
        data.ret.should.equal(321)
        done()
      })
  })

  // 第 2 个 测试
  it('should able to throw error', (done) => {
    MyDB = class My extends DB {
      constructor(options) {
        super(options)
        this.plugin('endpoint', () => {
          return () => {
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve({
                  ret: this.options.ret
                })
              })
            })
          }
        })
      }
    }
    const myDB = new MyDB({
      ret: 321,
      url: 'ppp://321'
    })

    myDB.get(null, {
        nocache: true
      })
      .done((data) => {
        xxxx; // throw an error
      }).catch(e => {
        e.message.should.equal('DB(ppp://321) xxxx is not defined')
        done()
      })
  })

  // 第 3 个 测试
  // 这个没看懂 引入 judge 插件做什么？
  it('should able to use jQuery.Defer', (done) => {
    DDB = class MyDB extends DB {
      constructor(options) {
        super(options)
        this.plugin('endpoint', () => {
          return () => {
            // 创建一个 Deffered 对象
            const defer = $.Deferred()
            setTimeout(() => {
              defer.resolve({
                ret: 123
              })
            })
            return defer
          }
        })
        // 添加一个 judge 插件
        this.plugin('judge', (data) => {
          return true
        })
      }
    }

    const dDB = new DDB

    dDB.get(null, {
        nocache: true
      })
      .done(data => {
        done()
      })
  })

  // 第 4 个 测试
  // 这个没看懂 引入 judge 插件做什么？
  it('should able to throw error when using jQuery.Defer', (done) => {
    DDB = class MyDB extends DB {
      constructor(options) {
        super(options)
        this.plugin('endpoint', () => {
          return () => {
            // 创建一个 Deffered 对象
            const defer = $.Deferred()
            setTimeout(() => {
              defer.resolve({
                ret: 123
              })
            })
            return defer
          }
        })
        // 添加一个 judge 插件
        this.plugin('judge', (data) => {
          return true
        })
      }
    }
    const dDB = new DDB({
      ret: 321,
      url: 'ppp://321'
    })

    dDB.get(null, {
        nocache: true
      })
      .done((data) => {
        xxxx; // throw an error
      }).catch(e => {
        e.message.should.equal('DB(ppp://321) xxxx is not defined')
        done()
      })
  })

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

  // 第 6 个 测试
  it('should able to use error plugin', (done) => {
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
        this.plugin('error', (data) => {
          return {
            data
          }
        })
      }
    }

    const xDB = new XDB

    xDB.get()
      .fail(e => {
        e.data.hasError.should.ok()
        done()
      })
  })

  // 第 7 个 测试
  describe('defer error', () => {
    let db
    before(() => {
      window._ENV_ = 'dev'
    })

    it('should throw an error when have not use fail method to listen the error', (done) => {
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

      const xDB = new XDB({
        url: 'kk://123'
      })

      xDB.get({
          nocache: true
        })
        .catch((e) => {
          e.message.should.equal('You need use fail method to get the error: {"hasError":true}')
          done()
        })
    })

    after(() => {
      window._ENV_ = undefined
      delete window._ENV_
    })
  })

  // 第 8 个 测试
  describe('cache default', () => {
    let db
    before((done) => {
      MyDB = class My extends DB {
        constructor(options) {
          super(options)
          this.plugin('endpoint', () => {
            return () => {
              return new Promise((resolve, reject) => {
                setTimeout(() => {
                  resolve({
                    ret: this.options.ret
                  })
                })
              })
            }
          })
        }
      }
      db = new MyDB({
        ret: 123,
        url: 'ppp://123'
      })
      db.get()
        .done((data) => {
          data.ret.should.equal(123)
          done()
        })
    })

    it('should able to use cache', (done) => {
      db.get()
        .done((data, flag) => {
          if (flag) {
            flag.should.equal('CACHE')
            data.ret.should.equal(123)
            done()
          } else {
            data.ret.should.equal(123)
          }
        })
    })

    after((done) => {
      setTimeout(() => {
        localStorage.clear()
        done()
      }, 100)
    })
  })

  // 第 9 个 测试
  describe('cache lazy', () => {
    let db
    before((done) => {
      MyDB = class My extends DB {
        constructor(options) {
          super(options)
          this.plugin('endpoint', () => {
            return () => {
              return new Promise((resolve, reject) => {
                setTimeout(() => {
                  resolve({
                    ret: this.options.ret
                  })
                })
              })
            }
          })
        }
      }
      db = new MyDB({
        ret: 123,
        url: 'ppp://123'
      })
      db.get()
        .done((data) => {
          data.ret.should.equal(123)
          done()
        })
    })

    it('should able to use cache', (done) => {
      db.get(null, {
          lazy: true
        })
        .done((data, flag) => {
          flag.should.equal('CACHE')
          data.ret.should.equal(123)
          done()
        })
    })

    after((done) => {
      setTimeout(() => {
        localStorage.clear()
        done()
      }, 100)
    })
  })

  // 第 10 个测试用例
  describe('cache refresh', () => {
    let db
    before((done) => {
      MyDB = class My extends DB {
        constructor(options) {
          super(options)
          this.plugin('endpoint', () => {
            return () => {
              return new Promise((resolve, reject) => {
                setTimeout(() => {
                  resolve({
                    ret: this.options.ret
                  })
                })
              })
            }
          })
        }
      }
      db = new MyDB({
        ret: 123,
        url: 'ppp://123'
      })
      db.get()
        .done((data) => {
          data.ret.should.equal(123)
          done()
        })
    })

    it('should able to use cache', (done) => {
      db.get(null, {
          refresh: 10000
        })
        .done((data, flag) => {
          flag.should.equal('CACHE')
          data.ret.should.equal(123)
          done()
        })
    })

    it('should able to use cache', (done) => {
      db.get(null, {
          refresh: 1
        })
        .done((data, flag) => {
          if (flag) {
            flag.should.equal('CACHE')
            data.ret.should.equal(123)
            done()
          } else {
            data.ret.should.equal(123)
          }
        })
    })

    after((done) => {
      setTimeout(() => {
        localStorage.clear()
        done()
      }, 100)
    })
  })

  // 第 11 个测试
  describe('cache lazy & refresh', () => {
    let db
    before((done) => {
      MyDB = class My extends DB {
        constructor(options) {
          super(options)
          this.plugin('endpoint', () => {
            return () => {
              return new Promise((resolve, reject) => {
                setTimeout(() => {
                  resolve({
                    ret: this.options.ret
                  })
                })
              })
            }
          })
        }
      }
      db = new MyDB({
        ret: 123,
        url: 'ppp://123'
      })
      db.get()
        .done((data) => {
          data.ret.should.equal(123)
          done()
        })
    })

    it('should able to use cache', (done) => {
      db.get(null, {
          lazy: true,
          refresh: 10000
        })
        .done((data, flag) => {
          flag.should.equal('CACHE')
          data.ret.should.equal(123)
          done()
        })
    })

    it('should able to use cache', (done) => {
      db.get(null, {
          lazy: true,
          refresh: 1
        })
        .done((data, flag) => {
          (flag === undefined).should.be.ok()
          data.ret.should.equal(123)
          done()
        })
    })

    after((done) => {
      setTimeout(() => {
        localStorage.clear()
        done()
      }, 100)
    })
  })
})
import _DB from '../index.js'

describe('omelete-db', () => {
  let MyDB
  let DB

  before(done => {
    DB = _DB
    done()
  })

  it('test: karma & mocha is run success', () => {
    'test should.js'.should.equal('test should.js')
  })

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
})
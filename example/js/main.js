require.config({
  // baseUrl: 'js',
  paths: {
    'pkg/omelete-db/0.0.1/index': 'index',
  }
});

require(['pkg/omelete-db/0.0.1/index'], function (DB) {
  const MyDB = class My extends DB {
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
      console.log(data)
    })
});
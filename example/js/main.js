require.config({
  // baseUrl: 'js',
  paths: {
    'pkg/omelete-db/0.0.1/index': 'index',
    'axios': 'https://unpkg.com/axios/dist/axios.min'
  }
});

require(['pkg/omelete-db/0.0.1/index', 'axios'], function (DB, axios) {
  const MyDB = class My extends DB {
    constructor(options) {
      super(options)
      this.plugin('endpoint', () => {
        return () => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              axios.get(`${options.url}`)
                .then(function (response) {
                  var data = response.data
                  resolve({
                    ret: data.ret,
                    data: data.res
                  })
                  console.log('resolve')
                }, function(err) {
                  reject({
                    ret: 400
                  })
                }
              )
            })
          })
        }
      })
    }
  }
  const myDB = new MyDB({
    url: 'https://www.easy-mock.com/mock/59c74abbe0dc663341b6ef18/omelete-db/200'
  })
  myDB.get()
    .done((data) => {
      console.log(data)
    })
});
Omelete-DB 前端数据缓存方案

感谢 @miniflycn 老师

# 缓存设计

### 可用 options

* refresh(ms)，304时间
* lazy(boolean)，懒更新
* level(1-3)，分3级缓存

### key 的组成

```javascript
key = fn(
  url: string, // 链接
  data: Object, // 入参数据
  level: number, // 数据等级，用于清理数据，一共3级
  timestamp: number // 时间戳，用于清理数据
)
```

### 缓存清理逻辑(缓存策略请添加)

* 当拿N级数据进行存储失败时，如果M <= N，清理M(其实为1)级数据
* 如果清理完依然不能存储M++
* 如果M大于3，则直接调用localStorage.clear()清理所有数据

### 使用方法

以 requirejs 为例

```javascript
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
```

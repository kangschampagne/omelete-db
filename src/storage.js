// PROTOCOL_VERSION use to check the storage version
const PROTOCOL_VERSION = 1
// local storage key
let keys = []
// memory
let _ = []

/**
 * 从 cookie 中 寻找 最新的 mid
 */
const mid = function () {
  const reg = /(^| )last_mid=([^;]*)(;|$)/
  const arr = document.cookie.match(reg)
  if (arr) {
    return arr[2]
  }
  return '$_stranger_$'
}()

/**
 * 判断环境是否支持 localStorage
 * @function compat
 * @return {Boolean}
 */
function compat() {
  return !!window.localStorage
}

/**
 * 初始化 localStorage, 并取出所有的 key
 * @function init
 */
function init() {
  keys = Object.keys(window.localStorage)
}

/**
 * 获取 不同等级下的 key 的形式，可自定义
 * @function getTarget
 * @param {String} key 
 * @param {Number} level 
 * @return {String} key formate key for save to storage
 */
function getTarget(key, level) {
  return level > 3 ?
    `omelete${level}\u2702$_SYSTEM_$\u2702${key}\u2702` :
    `omelete${level}\u2702${mid}\u2702${key}\u2702`
}

/**
 * 获取 localStorage 中 对应 key 的值
 * @param {String} key 
 */
function get(key) {
  const arr = key.split('\u2702')
  let res
  // try to get memory data
  if (arr.length > 3) res = _[arr[2]]
  if (!res) {
    try {
      res = JSON.parse(localStorage[key])
      if (res.v === PROTOCOL_VERSION) {
        res = res.r
      } else {
        removeKeys([key])
        res = false
      }
    } catch (e) {
      keys.length = 0
      localStorage.clear() // cannot get clear all localStorage
      res = false
    }
  }
  return res
}

/**
 * 判断 localStorage 中是否有对应的 key
 * @param {String} key
 * @return {String|Object} res
 */
function has(key, level = 1) {
  const target = getTarget(key, level)
  for (let i = 0, len = keys.length; i < len; i++) {
    if (keys[i].indexOf(target) === 0) {
      return keys[i]
    }
  }
  return false
}

/**
 * 执行保存动作，并做保存前的条件筛选，并使用 memory 进行缓存
 * @param {String} key 保存的 key
 * @param {String|Object} value 对应的值 
 * @param {Number} level 数据等级
 */
function save(key, value, level = 1) {
  // 只存储 对象
  if (typeof value !== 'object') return
  // 存到 memory
  _[key] = value
  // 存到 localStorage
  save2Local(key, value, level, 0)
}

/**
 * 将数据存入 localStorage， 并做一些 存爆 的异常处理以及 数据等级处理
 * @param {String} key 
 * @param {String|Object} value 
 * @param {Number} level 
 * @param {Number} removeLevel 
 */
function save2Local(key, value, level, removeLevel) {
  value = {
    r: value,
    v: PROTOCOL_VERSION
  }
  setTimeout(() => {
    removeAll(key, level)
    const json = JSON.stringify(value)
    if (json.length > 100000) {
      console.log('warn', `[API_REPONSE_TOO_BIG]${key}`)
      return
    }
    const k = `${getTarget(key, level)}${+new Date}`
    // 存爆处理
    try {
      window.localStorage[k] = json
      keys.push(k)
    } catch (err) {
      // 存满报错，删掉等级较低的 数据
      if (removeLevel <= level) {
        removeData(removeLevel)
        // 再执行保存, 将删除等级再加一级
        save2Local(key, level, value, removeLevel++)
      }
    }
  }, 0)
}

/**
 * 寻找 某一数据，其同等级的所有数据，并将 key暂存，执行删除操作
 * @param {String} key 
 * @param {Number} level 
 */
function removeAll(key, level) {
  const target = getTarget(key, level)
  const removeList = []
  for (let i = 0, len = keys.length; i < len; i++) {
    if (keys[i].indexOf(target) === 0) {
      removeList.push(keys[i])
    }
  }
  removeKeys(removeList)
}

/**
 * 直接 删除 某一等级 的所有数据
 * @param {Number} level 
 */
function removeData(level) {
  const removeList = []
  if (level > 4) {
    keys.length = 0
    window.localStorage.clear()
    return
  } else if (level === 0) {
    // 移除不同用户的 localstorage
    const reg = /omelete[1-3]\u2702([^\u2702]+)/
    for (let i = 0, l = keys.length; i < l; i++) {
      const match = keys[i].match(reg)
      if (
        match && match[1] !== mid // 不属于该用户
      ) {
        removeList.push(keys[i])
      }
    }
  } else {
    const target = `omelete${level}\u2702`
    for (let i = 0, len = keys.length; i < len; i++) {
      if (keys[i].indexOf(target) === 0) {
        // 找到这些等级的数据
        removeList.push(keys[i])
      }
    }
  }
  removeKeys(removeList)
}

/**
 * 遍历 keyList 中的每一项， 删除 keys中的项 和 localStorage中对应的项
 * @param {*} keyList 
 */
function removeKeys(keyList) {
  for (let i = 0, len = keyList.length; i < len; i++) {
    const key = keyList[i]
    // 同时 删除 keys 中的 key
    const index = keys.indexOf(key)
    if (index >= 0) keys.splice(index, 1)
    window.localStorage.removeItem(key)
  }
}

module.exports = {
  compat,
  init,
  save,
  has,
  get
}
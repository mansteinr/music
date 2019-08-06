
export function format (interval) {
  interval = interval | 0 // 向下取整
  const minute = interval / 60 | 0
  const second = pad(interval % 60)
  
  return `${minute}:${second}`
}

function pad (num, n = 2) {
  let len = num.toString().length
  while (len < n) {
    num = '0' + num
    len++ 
  }
  return num
}

// 返回min和max之间的随机数
function getRandomIndex (min, max) {
  return Math.floor(Math.random() * (max -min + 1) + min)
}

// export function shuffle (arr) {
//   if (!arr.length) return
//   let _arr = arr.splice() // 复制一份 防止对原数组造成影响
//   _arr.forEach((v, k) => {
//     // 获取一个随机的索引 将当前的的和随机的索引之间对换 打乱顺序
//     // 既可以得到随机数组
//     let j = getRandomIndex(0, k) 
//     let t = v
//     _arr[j] = t
//   })
//   return _arr
// }

export function shuffle (arr) {
   // 复制一份 防止对原数组造成影响
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    //     // 获取一个随机的索引 将当前的的和随机的索引之间对换 打乱顺序
//     // 既可以得到随机数组
    let j = getRandomIndex(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}
//截留函数
export function debounce (func, delay) {
  // 返回一个新的函数 这个新函数 延迟返回
  // 避免输入框输入的时候 反复调用函数
  let timer 
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

function insertArr (arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  // 如果等于0  则是第一条数据 什么都需要做
  if (index === 0) {
    return
  }
  // 如果不少第一条 则删除之前的 再把当前的这条插入数组的第一个位置
  // 有的话 删除在插入 无的话 则直接插入
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    // 将数组中的最后一个删除
    arr.pop()
  }
  // return arr
}

// 存储搜素历史 最多存储15条 大于15条 则将最原始的剔除

export function saveSearch (query) {
  // 获取是否已经存储搜索历史
  let searches = localStorage.getItem('search') ? JSON.parse(localStorage.getItem('search')) : []
  insertArr(searches, query, (v) => {
    return v === query
  }, 15)
  // searches存储本地
  localStorage.setItem('search', JSON.stringify(searches))
  return searches
}


function deleteArray (arr, compare) {
  let index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function deleteSearch (query) {
  let searches = localStorage.getItem('search') ? JSON.parse(localStorage.getItem('search')) : []
  deleteArray(searches, (item) => {
    return item === query
  })
  // searches存储本地
  localStorage.setItem('search', JSON.stringify(searches))
  return searches
}

export function clearSearch () {
  localStorage.removeItem('search')
  return []
}

//定义常量 存储200首歌曲
const PALY_KEY = '_play_', PLay_MAX_LENGTH = 200
const FAVORITE_KEY = '_favorite_', FAVORITE_MAX_LENGTH = 200

export function savePlay (song) {
  // 获取当前存储的数据 没有则为空数组
  let songs = localStorage.getItem(PALY_KEY) ? JSON.parse(localStorage.getItem(PALY_KEY)) : []
  insertArr(songs, song, (v) => {
    // 比较函数 如果song存在 则移动前面
    return v.id === song.id
  }, PLay_MAX_LENGTH)
  // 将数据 存储在本地
  localStorage.setItem(PALY_KEY, JSON.stringify(songs))
  return songs
}

export function loadPaly () {
  return localStorage.getItem(PALY_KEY) ? JSON.parse(localStorage.getItem(PALY_KEY)) : []
}

export function saveFavorite (song) {
  let songs = localStorage.getItem(FAVORITE_KEY) ? JSON.parse(localStorage.getItem(FAVORITE_KEY)) : []
  insertArr(songs, song, (v) => {
    // 比较函数 如果song存在 则移动前面
    return v.id === song.id
  }, FAVORITE_MAX_LENGTH)
  localStorage.setItem(FAVORITE_KEY, JSON.stringify(songs))
  return songs
}

export function deleteFavorite (song) {
  let songs = localStorage.getItem(FAVORITE_KEY) ? JSON.parse(localStorage.getItem(FAVORITE_KEY)) : []
  deleteArray(songs, (item) => {
    return song.id === item.id
  })
  localStorage.setItem(FAVORITE_KEY, JSON.stringify(songs))
  return songs
}
// 初始化favorite歌曲
export function loadFavorite () {
  return localStorage.getItem(FAVORITE_KEY) ? JSON.parse(localStorage.getItem(FAVORITE_KEY)) : []
}
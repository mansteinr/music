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


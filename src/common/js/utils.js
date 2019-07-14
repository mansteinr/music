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

export function shuffle (arr) {
  if (!arr.length) return
  arr.forEach((v, k) => {
    // 获取一个随机的索引 将当前的的和随机的索引之间对换 打乱顺序
    // 既可以得到随机数组
    let j = getRandomIndex(0, k) 
    let t = v
    arr[j] = t
  })
  return arr
}


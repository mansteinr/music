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
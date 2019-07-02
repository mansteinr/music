/**
 * dom操作的一些方法
 */
// 增加类名
export function addClass (el, className) {
  if (hasClass(el, className)) return
  el.classList.add(className)
}
 /**检测是否含有类名 */
export function hasClass (el, className) {
  // return [...el.classList].includes(className)
  // return el.classList.contains(className)
  // (^|\\s) 空白字符
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

export function getData (el, name, val) {
  const prefix = 'data-'
  if (val) {
    return el.setAttribute(prefix + name, val)
  } else {
    return el.getAttributer(prefix + name)
  }
}
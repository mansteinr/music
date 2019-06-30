import './index.styl'
 let installed = false
// 避免重复install，设立flag
const loading =  {
 show(context = '') {
  if (installed) return
 // 如果页面有loading则不继续执行
 if (document.querySelector('#vue-loading')) return
  // 1、创建构造器，定义loading模板
  let divWrapper = document.createElement('div')
  divWrapper.setAttribute("id","vue-loading")
  let div = document.createElement('div')
  div.setAttribute('class','loader')
  let span = document.createElement('span')
  span.className = 'loading-context'
  span.innerHTML = context
  divWrapper.appendChild(div)
  divWrapper.appendChild(span)
  // 3、把创建的实例添加到body中
  document.body.appendChild(divWrapper)
  // 阻止遮罩滑动
  document.querySelector('#vue-loading').addEventListener('touchmove', function (e) {
    e.stopPropagation()
    e.preventDefault()
  })
  installed = true
 },
 hide() {
  let tpl = document.querySelector('#vue-loading')
  if(!tpl) return
  document.body.removeChild(tpl)
 }
}
export default loading

import Axios from 'axios'
import loading from '@/base/loading'

export function axios(url, data, method = 'post', params = {}, responseType = 'json') {
  let options = {
    method: method,
    url: url,
    responseType: responseType,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  }
  loading.show()
  if (method === 'post') { // get post 方法兼容
    options = Object.assign(options, {data: data}, { params })
  } else {
    options = Object.assign(options, {params: data})
  }

  return new Promise((resolve, reject) => {
    Axios(options).then(res => {
      loading.hide()

      if (url.indexOf('getPurlUrl') > -1) {
        resolve(res)
        return
      }
      
      if(res.data.code === 0) {
        resolve(res.data)
      } else {
        reject('失败')
      }
    }).catch(err => {
      loading.hide()
      
      if(err) {
        reject(err)
      }
    })
  })
}
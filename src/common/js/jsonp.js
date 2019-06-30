import originJSONP from 'jsonp'
import { ERR_Ok } from '@/api/config'
import loading from "@/base/loading"

export default function jsonp (url, data, options) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  loading.show()
  return new Promise((resolve, reject) => {
    originJSONP(url, options, (err, data) => {
      if (!err && data.code === ERR_Ok) {
        resolve(data)
      } else {
        reject(err)
      }
      loading.hide()
    })
  }).catch(err => {
    loading.hide()
    if(err) {
      throw(err)
    }
  })
}

function param (data) {
  let url = ''
  for (let k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += `&${k}=${encodeURIComponent(value)}`
  }
  return url ? url.substring(1) : ''
}
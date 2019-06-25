import jsonp from '@/common/js/jsonp'
import { commonParam, options } from './config.js'

export function getRecommend () {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  
  const data = Object.assgin(commonParam, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1,
  })
  return jsonp(url, data, options)
}
import jsonp from '@/common/js/jsonp'
import { axios } from '@/common/js/axios'
import { commonParams, options } from './config'

const debug = process.env.NODE_ENV !== 'production'
export function getTopList () {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'

  const data = Object.assign({}, commonParams, {
    g_tk: 1928093487,
    jsonpCallback: 'jp0',
    format: 'jsonp',
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })
  // console.log(00)
  return jsonp(url, data, options)
}

export function getMusicList (topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'

  const data = Object.assign({}, commonParams, {
    topid,
    g_tk: 1928093487,
    needNewCode: 1,
    uin: 0,
    tpl: 3,
    format: 'jsonp',
    page: 'detail',
    type: 'top',
    platform: 'h5'
  })

  return jsonp(url, data, options)
}

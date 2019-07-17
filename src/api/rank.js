import jsonp from '@/common/js/jsonp'
import { axios } from '@/common/js/axios'
import { commonParams, options } from './config'

const debug = process.env.NODE_ENV !== 'production'

export function getTopList () {
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  const data = Object.assign({}, commonParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5',
    '-': 'getUCGI1598428001894152',
    data: JSON.stringify(
      {
        "detail":
        {
          "module": "musicToplist.ToplistInfoServer", "method": "GetDetail",
          "param": { "topId": 6, "offset": 0, "num": 20, "period": new Date().toISOString().split('T')[0] }
        }, "comm": { "ct": 24, "cv": 0 }
      })
  })

  return jsonp(url, data, 'POST')
}

export function getMusicList (topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'

  const data = Object.assign({}, commonParams, {
    topid,
    needNewCode: 1,
    uin: 0,
    tpl: 3,
    page: 'detail',
    type: 'top',
    platform: 'h5'
  })

  return jsonp(url, data, options)
}

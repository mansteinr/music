import { ERR_Ok } from './config'
import { getUid } from '@/common/js/uid'
import { commonParams } from './config'
import { axios } from '@/common/js/axios'

const debug = process.env.NODE_ENV !== 'production'

export function getLyric (mid) {
  // 获取歌词
  const url = debug ? '/api/lyric' : 'http://ustbhuangyi.com/music/api/lyric'
  

  const data = Object.assign({}, commonParams, {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    format: 'json'
  })
  return axios(url, data, 'get')
}

export function getSongsUrl (songs) {
  const url = debug ? '/api/getPurlUrl' : 'http://ustbhuangyi.com/music/api/getPurlUrl'

  let mids = []
  let types = []

  songs.forEach((song) => {
    mids.push(song.mid)
    types.push(0)
  })

  const urlMid = genUrlMid(mids, types)

  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    uin: 0
  })

  return new Promise((resolve, reject) => {
    let tryTime = 3
    function request () {
      return axios(url, {
        comm: data,
        req_0: urlMid
      }).then(response => {
        const res = response.data
        if (res.code === ERR_Ok) {
          let urlMid = res.req_0
          if (urlMid && urlMid.code === ERR_Ok) {
            const purlMap = {}
            urlMid.data.midurlinfo.forEach(v => {
              if (v.purl) {
                purlMap[v.songmid] = v.purl
              }
            })
            if (Object.keys(purlMap).length > 0) {
              resolve(purlMap)
            } else {
              retry()
            }
          } else {
            retry()
          }
        } else {
          retry()
        }
      })
    }

    function retry () {
      if (--tryTime >= 0) {
        request()
      } else {
        reject(new Error('Can not get the songs url'))
      }
    }

    request()
  })
}

function genUrlMid (mids, types) {
  const guid = getUid()
  return {
    module: 'vkey.GetVkeyServer',
    method: 'CgiGetVkey',
    param: {
      guid,
      songmid: mids,
      songtype: types,
      uin: '0',
      loginflag: 0,
      platform: '23'
    }
  }
}

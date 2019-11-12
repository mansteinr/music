import jsonp from '@/common/js/jsonp'
import { axios } from '@/common/js/axios'
import { commonParams, options } from './config.js'

const debug = process.env.NODE_ENV !== 'production'

export function getRecommend() {
    const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

    const data = Object.assign(commonParams, {
        uin: 0,
        platform: 'h5',
        needNewCode: 1,
    })
    return jsonp(url, data, options)
}

// 获取歌单
export function getDiscList() {
    const url = '/api/getDiscList'
    const data = Object.assign({}, commonParams, {
        rnd: Math.random(),
        hostUin: 0,
        notice: 0,
        platform: 'yqq.json',
        needNewCode: 0,
        categoryId: 10000000,
        sortId: 5,
        sin: 0,
        ein: 19,
        inCharset: 'utf8',
        loginUin: 0,
        picmid: 1
    })
    return axios(url, data, 'get')
}

export function getSongList(disstid) {
    const url = debug ? '/api/getCdInfo' : 'http://ustbhuangyi.com/music/api/getCdInfo'
    const data = Object.assign({}, commonParams, {
        disstid,
        type: 1,
        json: 1,
        utf8: 1,
        onlysong: 0,
        platform: 'yqq',
        hostUin: 0,
        needNewCode: 0
    })

    return axios(url, data, 'get')
}
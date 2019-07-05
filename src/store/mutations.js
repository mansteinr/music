/**
 * 操作改变motataio
 */

import * as types from './mutation-types'
 
const mutations = {
  [types.SET_SINGER] (state, singer) {
    state.singer = singer
  }
}
export default mutations

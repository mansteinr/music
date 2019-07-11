/**
 * 一次提交多个mutations或者异步请求时 使用actions
 */
import * as types from './mutation-types'

export const selectPlay = function ({commit, state}, {list, index}) {
   commit(types.SET_SEQUENCE_LIST, list)
   commit(types.SET_PLAYLIST, list)
   commit(types.SET_CURRENT_INDEX, index)
   commit(types.SET_FULL_SCREEN, true)
   commit(types.SET_PLAYING_STATE, true)
 }
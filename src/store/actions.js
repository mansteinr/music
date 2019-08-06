/**
 * 一次提交多个mutations或者异步请求时 使用actions
 */
import * as types from './mutation-types'
import { playMode } from '@/api/config'
import {
  shuffle,
  saveSearch,
  deleteSearch,
  clearSearch,
  savePlay,
  deleteFavorite,
  saveFavorite
} from '../common/js/utils'

// 随机列表中的index对应顺序列表中的index
function findIndex (list, song) {
  return list.findIndex(v => {
    return v.id === song.id
  })
}

export const selectPlay = function ({ commit, state }, { list, index }) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
 
export const randomPlay = function ({ commit }, { list }) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_PLAYLIST, list)
  let randomlist = shuffle(list)
  commit(types.SET_PLAYLIST, randomlist)
  commit(types.SET_CURRENT_INDEX, 0)
}

export const insertSong = function ({ commit, state }, song) {
  // 不能直接修改state中的数据 所以.slice()复制一个副本 修改副本 在mutations里面修改数据
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let cureentSong = playList[currentIndex]
  // 判断要插入的歌曲在不在playList中斌返回索引
  let fpIndex = findIndex(playList, song)
  // 要插入的位置 是当前索引的下一个
  currentIndex++
  // 插入歌曲
  playList.splice(currentIndex, 0, song)
  // 如歌包含这首歌 要把之前相同的歌删掉
  if (fpIndex > -1) {
    // 如果当前插入的序号大于列表中的序号
    if (currentIndex > fpIndex) {
      playList.splice(fpIndex, 1)
      // 删除之后数组的总长度变短了 故当前索引也要减去1
      currentIndex--
    } else {
      playList.splice(fpIndex + 1, 1)
    }
  }
  // sequenceList 应该要插入的位置
  let currentSIndex = findIndex(sequenceList, cureentSong) + 1
  // 查找之前的sequenceList是否包含改歌曲的 有并返回索引
  let fsIndex = findIndex(sequenceList, song)

  sequenceList.splice(currentSIndex, 0, song)
  // 如歌包含这首歌 要把之前相同的歌删掉
  if (fsIndex > -1) {
    // 如果当前插入的序号大于列表中的序号
    if (currentIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  // 提交action
  commit(types.SET_PLAYLIST,playList)
  commit(types.SET_SEQUENCE_LIST,sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const saveSearchHistory = function ({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = function ({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const clearSearchHistory = function ({ commit }) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

// 删除playlist中的一个歌曲
export const deleteSong = function({ commit, state }, song) {
  // 不能直接修改state中的数据 所以.slice()复制一个副本 修改副本 在mutations里面修改数据
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let pIndex = findIndex(playList, song)
  playList.splice(pIndex, 1)
  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)
  // 当前歌曲 在要删除的歌曲之后
  if(currentIndex > pIndex || currentIndex === playList.length) {
    currentIndex--
  }
  // 提交commit
  commit(types.SET_PLAYLIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  const playingState = playList.length > 0
  commit(types.SET_PLAYING_STATE, playingState)
}

// 清空playlist
export const deleteSongList = function({commit}) {
    // 提交commit
    commit(types.SET_PLAYLIST, [])
    commit(types.SET_SEQUENCE_LIST, [])
    commit(types.SET_CURRENT_INDEX, -1)
    commit(types.SET_PLAYING_STATE, false)
}
// 收藏歌曲
export const savePlayHistory = function ({ commit }, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}
// 删除收藏歌曲
export const saveFavoriteList = function ({ commit }, song) {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}
// 删除收藏歌曲
export const deleteFavoriteList = function ({ commit }, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}
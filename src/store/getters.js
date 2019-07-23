/**
 * 修改完mutations之后 通过getter映射出去
 * 这样组将就可以通过getters获取到数据
 */

export const mode = state => state.mode
export const singer = state => state.singer
export const playing = state => state.playing
export const playList = state => state.playList
export const fullScreen = state => state.fullScreen
export const sequenceList = state => state.sequenceList
export const currentIndex = state => state.currentIndex
// 计算当前播放的歌曲
export const currentSong = (state) => {
  return state.playList[state.currentIndex] || {}
}

export const disc = state => state.disc
// toplistz组件可以拿到数据
export const topList = state => state.topList
export const searchHistory = (state) => {
 return typeof state.searchHistory === 'string' ? JSON.parse(state.searchHistory) : state.searchHistory
}
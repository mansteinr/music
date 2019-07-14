
import { playMode } from '@/api/config'

const state = {
  singer: {},
  playing: false, // 播放状态
  fullScreen: false, // 播放器是否是全屏状态
  playList: [], // 播放列表
  sequenceList: [], // 原始数据
  currentIndex: -1, // 表示当前播放列表中的歌曲
  mode: playMode.sequence// 播放模式 随机，顺序
}
 
export default state
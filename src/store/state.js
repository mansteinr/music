/**
 * 状态文件
 */
const palyMode = {
  sequence: 0,
  loop: 1,
  random: 2
}

 const state = {
   singer: {},
   playing: false, // 播放状态
   fullScreen: false, // 播放器是否是全屏状态
   playList: [], // 播放列表
   sequenceList: [], // 
   currentIndex: -1, // 表示当前播放列表中的歌曲
   mode: palyMode.sequence// 播放模式 随机，顺序
}
 
export default state
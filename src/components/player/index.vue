<template>
  <div class="player" v-show="playList.length>0">
    <!-- vue 提供的钩子函数，可以在这里实现动画效果 -->
    <transition name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img height="100%" width="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle"
          @touchstart="middleTouchStart"
          @touchmove="middleTouchMove"
          @touchend="middleTouchEnd"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd">
                <img class="image" :class="cdCls" :src="currentSong.image">
              </div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine" 
                  class="text" 
                  v-for="(v, k) in currentLyric.lines" 
                  :class="{'current' : currentLineNum === k}"
                  :key="k">{{ v.txt }}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{ formatCurrentTime }}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="percentChange"></progress-bar>
            </div>
            <span class="time time-r">{{ currentDuration }}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <div class="imgWrapper">
            <img height="40" width="40" :class="cdCls" :src="currentSong.image">
          </div>
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :percent="percent">
            <i :class="miniIcon" class="icon-mini" @click.stop="togglePlaying"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <!-- 播放音乐 -->
    <!-- 当浏览器能够开始播放指定的音频/视频时，发生 canplay 事件。 -->
    <!-- 当音频/视频处于加载过程中时，会依次发生以下事件：
      loadstart 当浏览器已加载音频/视频的当前帧时
      durationchange 当音频/视频的时长已更改时
      loadedmetadata 当浏览器已加载音频/视频的元数据时
      loadeddata 当浏览器已加载音频/视频的当前帧时
      progress 	当浏览器正在下载音频/视频时
      canplay 当浏览器可以播放音频/视频时
      canplaythrough 当浏览器可在不因缓冲而停顿的情况下进行播放时
     -->
    <audio 
      ref="audio"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
      :src="currentSong.url"></audio>
  </div>
</template>

<script>
/**
 * 利用js创建css动画，利用第三方库 create-keyframe-animation
 */
import { format } from '@/common/js/utils'
import { mapGetters, mapMutations } from 'vuex'
import animations from 'create-keyframe-animation'
import ProgressBar from '@/base/progress-bar'
import ProgressCircle from '@/base/progress-circle'
import { playMode } from '@/api/config'
import { shuffle } from '@/common/js/utils'
import Lyric from 'lyric-parser'
import Scroll from '@/base/scroll'

export default {
  data() {
    return {
      /**
       * 当快速切换歌曲时，可能因为歌曲没有加载完成而导致报错
       * 但是audio数据加载完成之后会派发canplay函数
       * 可以利用这个函数 控制 当歌曲数据未加载完成时 禁止播放
       */
      songReady: false,
      // 歌曲当前播放的时间
      formatCurrentTime: 0,
      currentTime: 0,
      currentShow: 'cd',
      currentDuration: 0,
      currentLyric: null,
      currentLineNum: 0 // 当前歌词所在行
    }
  },
  computed: {
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniIcon() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    cdCls() {
      return this.playing ? 'play' : 'paused'
    },
    disableCls() {
      return this.songReady ? '' : 'disable'
    },
    percent() {
      // 当前的时间除以歌曲总时间 来计算当前比例
      return this.currentTime / this.currentSong.duration
    },
    iconMode() {
      // 播放模式的图标
      return this.mode === playMode.sequence ? 'icon-sequence' : (this.mode === playMode.loop ? 'icon-loop' : 'icon-random')
    },
    ...mapGetters([
      'fullScreen',
      'playList',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList'
    ])
  },
  methods: {
    middleTouchStart(e) {
      this.touch.initiated = true
      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    middleTouchMove(e) {
      if(!this.touch.initiated) return
      const touch = e.touches[0]
      const deltaX = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY
      // 如果y轴偏移量大于x轴 则不应该左右滑动
      if(Math.abs(deltaY) > Math.abs(deltaX)) {
        return
      }
      // 当滚动一半时自动滚动 反之回弹至原来
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      // 不能超过屏幕的宽度 右滑正向
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
      // 滑动的距离除以整个屏幕的宽度 得到百分比
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      // this.$refs.lyricList.$el 因为lyricList是个组件 要用$el取dom
      this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.lyricList.$el.style.transitionDuration = 0
      this.$refs.middleL.style.opacity = 1 - this.touch.percent
      this.$refs.middleL.style.transitionDuration = 0
    },
    middleTouchEnd(e) {
      if(this.touch.percent < 0.29) return
      let offsetWidth, opacity
      // 左边滑动还是右边滑动
      // 这个时候要处理两种情况 要么滚回去 要么滚下去
      if(this.currentShow === 'cd') { // 从右往左边滑动 只要滑动10% 就可以滑倒左边 反之返回右边
        if(this.touch.percent > 0.3) {
          offsetWidth = -window.innerWidth
          this.currentShow = 'lyric'
          opacity = 0
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        if(this.touch.percent < 0.7) {
          opacity = 1
          offsetWidth = 0
          this.currentShow = 'cd'
        } else {
          opacity = 0
          offsetWidth = -window.innerWidth
        }
      }
      // 设置位置
      this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.lyricList.$el.style.transitionDuration = '300ms'
      this.$refs.middleL.style.opacity = opacity
      this.$refs.middleL.style.transitionDuration = '300ms'
    },
    // 歌曲播放完成时
    end() {
      // 单曲循环模式
      if(this.mode === play.loop) {
        this.loop()
      } else {
        // 切换至下一首
        this.next()
      }
    },
    loop() { // 单曲循环模式
      this.$refs.audio.currentTime = 0
      // 重新调用pLay方法
      this.$refs.audio.play()
    },
    // 切换模式
    changeMode() {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if(mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIdnex(list)
      this.setPlayList(list)
    },
    // 切换模式的时候 不希望currentIdnex发生改变
    // 当currentIdnex 发生改变时 需要重置currentIdnex
    // 保证切换时歌曲不会发生改变
    resetCurrentIdnex(list) {
      // 当播放模式
      let index = list.findIndex(v => {
        return v.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    getLyric() {
      this.currentSong.getLyric().then(res => {
        this.currentLyric = new Lyric(res, this.handleLyric)
        if(this.playing) {
          this.currentLyric.play()
        }
      })
    },
    // 当歌词每一行改变时 就会触发这个回调函数
    handleLyric({lineNum, txt}) {
      this.currentLineNum = lineNum
      // 保持滚动在中间
      if(lineNum > 5) {
        // 当前元素减去5
        let lineEl = this.$refs.lyricLine[lineNum - 5]
        //1000表示过渡动画时间
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        // 滚动到底部
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
    },
    percentChange(percent) {
      // 当拖动进度条时 将歌曲进度设置未相应的百分比
      this.$refs.audio.currentTime = this.currentSong.duration * percent
      if(!this.playing) { // 拖动之后发现没有播放 则手动设置播放
        this.togglePlaying()
      }
    },
    updateTime(e) {
      // 当前歌曲播放的时间
      this.currentTime =e.target.currentTime
      this.formatCurrentTime = format(e.target.currentTime)
      this.currentDuration = format(this.currentSong.duration)
    },
    ready() {
      this.songReady = true
    },
    // 防止网络出错
    error() {
      this.songReady = true
    },
    /**
     * 上一首
     */
    prev() {
      // 歌曲数据未加载完成
      if(!this.songReady) return
      let index = this.currentIndex - 1
      // 判断是否是第一首歌 如果是 则置为最后一首歌  因为这是顺序循环播放
      if (index === -1 ) {
        index = this.playList.length -1
      }
      // 修改mutation中的currentIndex
      this.setCurrentIndex(index)
      // 切换的时候 如果是暂停的 将icon图标改变
      if(!this.playing) {
        this.togglePlaying()
      }
      // 完成之后置为false
      this.songReady = false
    },
    /**
     * 下一首
     */
    next() {
      // 歌曲数据未加载完成
      if(!this.songReady) return
      let index  = this.currentIndex + 1
      // 判断是否是最后一首歌 如果是 则置为0  因为这是顺序循环播放
      if (index === this.playList.length ) {
        index = 0
      }
      // 修改mutation中的currentIndex
      this.setCurrentIndex(index)
       // 切换的时候 如果是暂停的 将icon图标改变
      if(!this.playing) {
        this.togglePlaying()
      }
      // 完成之后置为false
      this.songReady = false
    },
    // 切换暂停播放状态
    togglePlaying() {
      // 虽然改变了playing的状态 但是没暂停  这个在watch中完成的
      this.setPlayingState(!this.playing)
    },
    back() {
      this.setFullScreen(false)
    },
    open() {
      this.setFullScreen(true)
    },
    // el表示动画左右的dom, done为回掉函数
    // done执行后会自动调到下个函数after-enter函数中
    enter(el, done) {
      // mini播放器移动到大播放器的唱片位置
      const  {x, y, scale } = this.getPosotionAndScale()
      // 定义动画
      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      }
      // 注册
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })

      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter() {
      // 注销
      animations.unregisterAnimation('move')
      // 动画清空
      this.$refs.cdWrapper.style.animation = ''
    },
    leave(el, done) {
      // 离开的时候使用原生的 没有用到create-keyframe-animation插件
      this.$refs.cdWrapper.style.transition = 'all .4s'
      // 获取位置
      const  {x, y, scale } = this.getPosotionAndScale()
      this.$refs.cdWrapper.style.transform = `translate3d(${x}px,${y}px,0) scale(${scale})`
      // transitionend 事件在 CSS 完成过渡后触发。 原生提供的API
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave() {
       // 动画清空
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style.transform = ''
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    }),
    // 获取mini播放器中的唱片位置
    getPosotionAndScale() {
      // mini播放器中的唱片的宽度 这是css中定义的
      const targetWidth = 40
      // mini播放器中的唱片的中心位置 距离左边的距离
      const paddingLeft = 40
      // mini播放器中的唱片的中心位置 距离底部的距离
      const paddingBottom = 30
      // 大唱片容器到顶部的距离 即class="middle"到顶部的距离 css定义的
      const paddingTop = 80
      // 大唱片容器的宽度 即class="cd-wrapper" css定义的
      const width = window.innerWidth * 0.8
      // 初始的缩放比列
      const scale = targetWidth / width
      // 初始的x坐标 即小唱片的中心到大唱片中心的距离
      const x = -(window.innerWidth / 2 - paddingLeft)
      // 初始的y坐标 即小唱片的中心到大唱片中心的距离
      const y = window.innerHeight - paddingTop - width / 2  - paddingBottom
      return {
        x,
        y,
        scale
      }
    }
  },
  created() {
    this.touch = {}
  },
  watch: {
    // 当currentSong发生变化时 播放音乐 调用audio的API play即可实现播放功能
    currentSong(newSong, oldSong) {
      // 当切换播放模式时 防止在暂停状态下切换触发播放
      if(newSong.id === oldSong.id) return
      // nextTick 防止audio不存在 导致报错
      this.$nextTick(() => {
        this.$refs.audio.play()
        // currentSong是通过在列表中计算得到的 也属于class Song
        this.getLyric()
      })
    },
    // 切换播放暂停状态
    playing(newPlaying) {
      this.$nextTick(() => {
        newPlaying ? this.$refs.audio.play() : this.$refs.audio.pause()
      })
    }
  },
  components:{
    Scroll,
    ProgressBar,
    ProgressCircle
  }
}
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"
  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            box-sizing: border-box
            height: 100%
            .cd
              width: 100%
              height: 100%
              border-radius: 50%
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                box-sizing: border-box
                border-radius: 50%
                border: 10px solid rgba(255, 255, 255, 0.1)
                &.play
                  animation: rotate 20s linear infinite forwards
                &.paused
                  animation-play-state: paused
                  -webkit-animation-play-state: paused
          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
            .pure-music
              padding-top: 50%
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          // 回弹效果
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
        // 从上面掉下来的效果
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        height: 40px
        padding: 0 10px 0 20px
        .imgWrapper
          height: 100%
          width: 100%
          img
            border-radius: 50%
            // 唱片旋转效果
            &.play
              animation: rotate 10s linear infinite forwards
            &.paused
              animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
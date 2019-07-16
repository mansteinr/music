<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" v-show="songs.length>0" ref="playBtn" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放</span>
        </div>
      </div>
    </div>
    <!-- bg-layer再歌曲文字下边 当文字上移的时候 它也跟着上移 -->
    <div class="bg-layer" ref="layer"></div>
    <scroll :data="songs" 
      :listen-scroll="listenScroll" 
      :probe-type="probeType" 
      @scroll="scroll"
      class="list" 
      ref="list">
      <div class="song-list-wrapper">
        <song-list @select="selectItem" :songs="songs"></song-list>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from '@/base/scroll'
import SongList from '@/base/song-list'
// 获取actions里面的是函数
import { mapActions } from 'vuex'
import { playlistMixin } from '@/common/js/mixin'

// 不让layer滚到最上面 即最上面预留点位置
const RESERVED_HEIGHT = 40 
export default {
  // 一个组件可以插入多个组件 一旦插入mixin 就将mixin中的代码定义在组件中了
  mixins: [ playlistMixin ],
  data() {
    return {
      scrollY: 0
    }
  },
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    bgStyle() {
      return `background-image: url(${this.bgImage})`
    }
  },
  methods: {
    // 这个方法定义在mixin中 可以将mixin中的方法覆盖掉
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.list.$el.style.bottom = bottom
      // 设置完成之后重新刷新一次
      this.$refs.list.refresh()
    },
    scroll(position) {
      // 拿到y轴滚动偏移量 就可以设置layer的偏移量
      this.scrollY = position.y
    },
    back() {
      this.$router.back()
    },
    // 接受子组件传递的信息
    selectItem(item, index) {
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    random() {
      this.randomPlay({
        list: this.songs
      })
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  },
  components: {
    Scroll,
    SongList
  },
  mounted() {
    // 记录背景图片的高度 防止layer层滚出去
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT
    // this.$refs.list.$el取到dom对象
    // 这个高度无法开始设置 因为每个浏览器的大小不同 背景图片高度不一样
    this.$refs.list.$el.style.top = `${this.$refs.bgImage.clientHeight}px`
  },
  created() {
    // 监听实时滚动
    this.probeType = 3
    this.listenScroll = true
  },
  watch: {
    scrollY(newY) {
      // 取最小值 防止layer滚出去
      let blur = 0, translateY = Math.max(this.minTranslateY, newY), zIndex = 0, scale = 1 
      this.$refs.layer.style['transform'] = `translate3d(0, ${translateY}px, 0)`
      // 下拉的时候 计算背景图片缩放的比列
      const percent = Math.abs(newY / this.imageHeight)
      if(newY > 0) {
        scale = 1 + percent
        zIndex = 10
      } else {
        // 模糊度
        blur = Math.min(20 * percent, 20)
      }
      // console.log(blur)
      // this.$refs.bgImage.style['WebkitFilter'] = `blur(${blur})px`
      // 当layer滚到顶部 设置样式
      if(newY < this.minTranslateY) {
        zIndex = 10
        this.$refs.playBtn.style.display='none'
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
      } else {
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = 0
        this.$refs.playBtn.style.display=''
        zIndex = 0
      }
      this.$refs.bgImage.style.zIndex = zIndex
      this.$refs.bgImage.style['transform'] = `scale(${scale})`
      // 苹果手机可以看到效果
      this.$refs.bgImage.style['filter'] = `blur(${blur})px`
    }
  }
}
</script>


<style lang="stylus" scoped>
  @import '../../common/stylus/variable'
  @import '../../common/stylus/mixin'

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      // filter blur(1px)
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: absolute
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>


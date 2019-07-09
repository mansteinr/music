<template>
  <div class="music-list">
    <div class="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage"></div>
    <!-- bg-layer再歌曲文字下边 当文字上移的时候 它也跟着上移 -->
    <div class="bg-layer" ref="layer"></div>
    <scroll :data="songs" 
      :listen-scroll="listenScroll" 
      :probe-type="probeType" 
      @scroll="scroll"
      class="list" 
      ref="list">
      <div class="song-list-wrapper">
        <song-list :songs="songs"></song-list>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from '@/base/scroll'
import SongList from '@/base/song-list'

// 不让layer滚到最上面 即最上面预留点位置
const RESERVED_HEIGHT = 40 
export default {
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
    scroll(position) {
      // 拿到y轴滚动偏移量 就可以设置layer的偏移量
      this.scrollY = position.y
    }
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
      let translateY = Math.max(this.minTranslateY, newY), zIndex = 0
      console.log(this.minTranslateY, newY)
      this.$refs.layer.style['transform'] = `translate3d(0, ${translateY}px, 0)`
      // 当layer滚到顶部 设置样式
      if(newY < this.minTranslateY) {
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
      } else {
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = 0
        zIndex = 0
      }
      this.$refs.bgImage.style.zIndex = zIndex
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
      filter blur(2px)
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


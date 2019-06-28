<template>
  <div class="recommend">
    <scroll class="recommend-content" :data="discList" ref="scroll">
      <div>
        <!-- 因为数据获取是异步过程 一开始就渲染数据为空 -->
        <div v-if="recommends.length" class="slider-wrapper">
          <slider>
            <div v-for="(v, k) in recommends" :key="k">
              <a :href="v.linkUrl">
                <img :src="v.picUrl" alt="">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌曲推荐</h1>
          <ul>
            <li v-for="(v, k) in discList" :key="k" class="item">
              <div class="icon">
                <img @load="loadImage" :src="v.imgurl" height="60" width="60" alt="">
              </div>
              <div class="text">
                <h2 class="name" v-html="v.creator.name"></h2>
                <p class="desc" v-html="v.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import { getRecommend, getDiscList } from '@/api/recommend'
import Slider from '@/base/slider'
import Scroll from '@/base/scroll'

export default {
  data () {
    return {
      recommends: [],
      discList: []
    }
  },
  created () {
    this._getRecommend()
    this._getDiscList()
  },
  methods: {
    _getRecommend() {
      getRecommend().then(res => {
        this.recommends = res.data.slider
      })
    },
    _getDiscList() {
      getDiscList().then(res => {
        this.discList = res.data.list
      })
    },
    // 为了歌单能够下拉至底部，需要监听img，然后刷新scroll组件
    //  this._getRecommend() this._getDiscList() 不知道谁先返回数据
    // 这样的话better-scroll组件可以计算高度不够 少了上面轮播图img高度
    loadImage() {
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh()
        this.checkLoaded = true
      }
      
    }
  },
  components: {
    Slider,
    Scroll
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable'

.recommend
  position fixed
  width 100%
  top 88px
  bottom 0px
  .recommend-content
    height 100%
    overflow hidden
    .slider-wrapper
      position relative
      width 100%
      overflow hidden
    .recommend-list
      color red
      .list-title
        height 65px
        line-height 65px
        text-align center
        font-size $font-size-medium
        color $color-theme
      .item
        display flex
        box-sizing border-box
        align-items center
        padding 0 20px 20px 20px
        .icon 
          flex 0 0 60px
          width 60px
          padding-right 20px
        .text
          display flex
          flex-direction column
          justify-content center
          flex 1px
          line-height 20px
          overflow hidden
          font-size $font-size-medium
          .name
            margin-bottom 10px
            color $color-text
          .desc
            color $color-text-d
    .loading-container
      position absolute
      width 100%
      top 50%
      transform translateY(-50%)
</style>

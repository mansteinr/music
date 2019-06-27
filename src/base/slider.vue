<template>
  <div class="slider" ref="slider">
    <!-- 需要设置sliderGroup的宽度 -->
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots"></div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import  { addClass } from '@/common/js/dom'

export default {
  data() {
    return {
      
    }
  },
  props: {
    // 是否循环
    loop: {
      type: Boolean,
      default: true
    },
    // 自动轮播
    autoPlay: {
      type: Boolean,
      default: true
    },
    // 轮播间隔
    interval: {
      type: Number,
      default: 4000
    }
  },
  mounted() {
    /**
     *  用延时器20ms也行 这里主要防止dom渲染之后不能滑动
     *  不能滑动的原因 只要是因为dom的宽计算不正确
     */

    this.$nextTick(() => {
      this.setSliderWidth(),
      this.initSlider()
    })
  },
  methods: {
    /**
     * 计算宽
     */
    setSliderWidth() {
      this.children = this.$refs.sliderGroup.children
      
      // 这是sliderGruop的宽带 
      let width = 0

      // 因为每个元素的宽度都要和 sliderWidth宽度相同
      let sliderWidth = this.$refs.slider.clientWidth
      
      for(let i  = 0; i < this.children.length; i++) {
        let child = this.children[i]
        addClass(child, 'slider-item')
        // 每个子元素的宽度等于父元素的宽度
        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }
      // 如果是自动播放的话 需要左右都要克隆一个 实现无缝滚动
      if (this.loop) {
        width += 2 * sliderWidth
      }

      this.$refs.sliderGroup.style.width = width + 'px'
    },
    initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        mementum: false,
        snap: true,
        snapLoop: this.loop,
        snapSpeed: 400,
        click: true
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '../common/stylus/variable'
  
  .slider
    min-height 1px
    .slider-group
      position relative
      overflow hidden
      white-space normal
      .slider-item
        float left
        box-sizing border-box
        overflow hidden
        text-align center
        a
          display block
          width 100%
          overflow hidden
          text-decoration none
        img 
          display block
          width 100%
    .dots
      position absolute
      right 0
      left 0
      bottom 12px
      text-align center
      font-size 0
      .dot
        display inline-block
        margin 0 4px
        width 8px

</style>



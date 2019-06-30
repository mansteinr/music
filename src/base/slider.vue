<template>
  <div class="slider" ref="slider">
    <!-- 需要设置sliderGroup的宽度 -->
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(v, k) in dots" :key='k' :class="{active: currentPageIndex === k}"></span>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import  { addClass } from '@/common/js/dom'
import { setTimeout, clearTimeout } from 'timers';

export default {
  data() {
    return {
      dots: [],
      currentPageIndex: 0
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
      this.setSliderWidth()
      // 初始化原点
      this.initDots()
      this.initSlider()

      if (this.autoPlay) { // 判断是否自动播放
        this.play()
      }
    })
    /**
     * 监听窗口改变事件，重新设置宽度即可
     */
    window.addEventListener('resize', () => {
      //如果slider未初始化，则直接返回， 反之重新设置宽
      if (!this.slider) return
      this.setSliderWidth(true)
      this.slider.refresh() // 重新刷新slider组件
    })
  },
  methods: {
    /**
     * 计算宽
     */
    setSliderWidth(isResize) {
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
      // 判断是否未resize 如果是敞口改变 则不需要复制两个
      if (this.loop && !isResize) {
        width += 2 * sliderWidth
      }

      this.$refs.sliderGroup.style.width = width + 'px'
    },
    initSlider() {
     this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        }
      })
      /**
       * 监听better-scroll的scrollEnd事件
       * 通过this.slider.getCurrentPage().pageX获取当前页面
       */
      this.slider.on('scrollEnd', () => {
        let pageIndex = this.slider.getCurrentPage().pageX
        this.currentPageIndex = pageIndex

        if (this.timer) {
          clearTimeout(this.timer)
          this.play()
        }
      })
    },
    // 初始化dots
    initDots() {
      this.dots = new Array(this.children.length)
    },
    /**
     * 自动播放
     */
    play() {
      this.timer = setTimeout(() => {
        this.slider.next()
      }, this.interval)
    }
  },
  // 组件销毁时 清楚延时器
  destroyed() {
    clearTimeout(this.timer)
  }
}
</script>

<style lang="stylus" scoped>
  @import '../common/stylus/variable'
  
  .slider
    min-height 1px
    position relative
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
        height 8px
        border-radius 50%
        background $color-text-l
        &.active
          width 20px
          border-radius 5px
          background $color-text-l
</style>



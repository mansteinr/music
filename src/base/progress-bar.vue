<template>
  <div class="progress-bar" ref="progressBar">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchend.prevent="progressTouchEnd"
        @touchmove.prevent="progressTouchMove"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
// 按钮的宽度
const progressBtnWidth = 16

export default {
  data() {
    return {

    }
  },
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created() {
    // 这个对象主要是 用来不同函数之间的共享数据使用
    this.touch = {}
  },
  methods: {
    progressTouchStart(e) {
      this.touch.initiated = true
      // 记录下 手指刚开始触摸是的x坐标
      this.touch.startx = e.touches[0].pageX
      // 记录progress的宽度 即小球的位置
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove(e){
      if(!this.touch.initiated) return
      // 纵向偏移量
      const deltaX = e.touches[0].pageX - this.touch.startx
      // 防止超出bar的宽度
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
      this.offset(offsetWidth)
    },
    progressTouchEnd(){
      this.touch.initiated = false
      this.triggerPercent()
    },
    offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
    },
    triggerPercent() {
      /**
       * 当拖动时  将歌曲进度设置到相应的进度
       */
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('percentChange', percent)
    }
  },
  watch: {
    // 根据百分比 移动进度条
    percent(newPercent) {
      if(newPercent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        // 偏移量 比列乘以bar的总宽度
        const offsetWidth = newPercent * barWidth
        // 
        this.offset(offsetWidth)
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../common/stylus/variable"
  
  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>


<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import { setTimeout } from 'timers';

  export default {
    props: {
      // 监听滚动事件类型，比如慢速滚动 快速滚动
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      data: { // b必传 当数据填充时 可以重新渲染
        type: Array,
        default: () => []
      },
      listenScroll: { // scroll组件要不要监听滚动事件
        type: Boolean,
        default: false
      }
    },
    methods: {
      initScroll() {
        if (!this.$refs.wrapper) return
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        })
        // 监听滚动事件 并将实时位置派发给父组件
        if (this.listenScroll) {
          this.scroll.on('scroll', (pos) => {
            this.$emit('scroll', pos)
          })
        }
      },
      enable() {
        this.scroll && this.scroll.enable()
      },
      disable() {
        this.scroll && this.scroll.disable()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      scrollTo() {
        this.scroll && this.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },
    mounted() {
      setTimeout(() => {
        this.initScroll()
      }, 20)
      // 用nextTick 无法监听到 scroll滚动事件
      // this.$nextTick(() => {
      //   this.initScroll()
      // })
    },
    watch: {
      data() {
        this.$nextTick(() => {
          this.refresh()
        })
      }
    }
  }
</script>


<style lang="stylus" scoped>

</style>


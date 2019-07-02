<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    // data() {
      
    // },
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
      data: {
        type: Array,
        default: () => []
      }
    },
    methods: {
      initScroll() {
        if (!this.$refs.wrapper) return
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        })
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
      this.$nextTick(() => {
        this.initScroll()
      })
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


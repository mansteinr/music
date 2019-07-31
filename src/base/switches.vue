<template>
  <ul class="switches">
    <li
      v-for="(v, k) in switches" :key="k"
      @click="switchItem(k)"
      class="switch-item"
      :class="{'active': currentIndex === k}"
      >
      <span> {{ v.name }} </span>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    switches: {
      type: Array,
      default: () => {}
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    // 基础组件不做业务逻辑处理
    switchItem(value) {
      this.$emit('switch', value)
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '../common/stylus/variable'
  .switches
    display flex
    align-items center
    width 240px
    margin 0 auto 
    border 1px solid $color-highlight-background
    border-radius 5px
    .switch-item
      flex 1
      padding 8px
      text-align center
      font-size $font-size-medium
      color $color-text-d
      &.active
        background $color-highlight-background
        color $color-text
</style>



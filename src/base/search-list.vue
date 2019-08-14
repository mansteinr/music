<template>
  <div class="search-list" v-show="searches.length">
    <transition-group tag="ul" name="list">
      <li @click="selectItem(v)" class="search-item" v-for="(v, k) in searches" :key="k">
        <span class="text"> {{ v }} </span>
        <span class="icon" @click.stop="deleteItem(v)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script>
export default {
  props: {
    searches: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    selectItem(value) {
      this.$emit('select', value)
    },
    deleteItem(value) {
      this.$emit('deleteItem', value)
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '../common/stylus/variable';
  
  .search-list
    .search-item
      display flex
      align-items center
      height 40px
      &.list-enter-active, &.list-leave-active
        transition all .1s
      &.list-enter, &.list-leave-to
        height 0
      .text
        flex 1
      .icon
        extend-click()
        .icon-delete
          font-size $font-size-small
          color $color-text-d
</style>


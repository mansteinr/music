<template>
  <div class="search-list" v-show="searches.length">
    <ul>
      <li @click="selectItem(v)" class="search-item" v-for="(v, k) in searches" :key="k">
        <span class="text"> {{ v }} </span>
        <span class="icon" @click.stop="deleteItem(v)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </ul>
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
      console.log(this.searches)
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
      .text
        flex 1
      .icon
        extend-click()
        .icon-delete
          font-size $font-size-small
          color $color-text-d
</style>


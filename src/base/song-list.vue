<template>
  <div class="song-list">
    <ul>
      <li class="item" 
        v-for="(v, k) in songs" 
        @click="selectItem(v, k)"
        :key="k">
        <div class="rank" v-show="rank">
          <span :class="getRankCls(k)" v-text="getRankText(k)"></span>
        </div>
        <div class="content">
          <h2 class="name">{{ v.name }}</h2>
          <p class="desc">{{ getDesc(v) }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    songs: {
      type: Array,
      default: () => []
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    selectItem(item, index) {
      // 向父组件派发点击事件 并将参数传递给父组件
      this.$emit('select', item, index)
    },
    getDesc(song) {
      return `${song.singer}。${song.album}`
    },
    getRankCls (index) {
      if (index <= 2) {
        return `icon icon${index}`
      } else {
        return 'text'
      }
    },
    getRankText (index) {
      if (index > 2) {
        return index + 1
      }
    }
  }
}
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../common/stylus/variable"
  @import "../common/stylus/mixin"
  .song-list
    .item
      display: flex
      align-items: center
      box-sizing: border-box
      height: 64px
      font-size: $font-size-medium
      .rank
        flex: 0 0 25px
        width: 25px
        margin-right: 30px
        text-align: center
        .icon
          display: inline-block
          width: 25px
          height: 24px
          background-size: 25px 24px
          &.icon0
            bg-image('../common/image/first')
          &.icon1
            bg-image('../common/image/second')
          &.icon2
            bg-image('../common/image/third')
        .text
          color: $color-theme
          font-size: $font-size-large
      .content
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          no-wrap()
          color: $color-text
        .desc
          no-wrap()
          margin-top: 4px
          color: $color-text-d
</style>
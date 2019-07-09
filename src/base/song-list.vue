<template>
  <div class="song-list">
    <ul>
      <li class="item" v-for="(v, k) in songs" :key="k">
        <div class="rank">
          <span></span>
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
    }
  },
  methods: {
    getDesc(song) {
      return `${song.singer}。${song.album}`
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
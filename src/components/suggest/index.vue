<template>
  <div class="suggest">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(v, k) in result" :key="k">
        <div class="icon">
          <i :class="getIconCls(v)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(v)"></p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { search } from '@/api/search'
import { filterSinger } from '@/common/js/song'
export default {
  data() {
    return {
      page: 1,
      result: []
    }
  },
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    search() {
      search(this.query, this.page, this.showSinger).then(res => {
        this.result = this.getResult(res.data)
      })
    },
    getIconCls(value) {
      if(value.type === 'singer') {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getDisplayName(value) {
      if(value.type === 'singer') {
        return value.singername
      } else {
        return `${value.songname}-${filterSinger(value.singer)}`
      }
    },
    getResult(data) {
      let ret = []
      if(data.zhida && data.zhida.singerid) {
        // type 是用来区分是歌手还是歌曲
        ret.push({...data.zhida, ...{type: 'singer'}})
      }
      if(data.song) {
        ret = ret.concat(data.song.list)
      }
      return ret
    }
  },
  watch: {
    query() {
      this.search()
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "../../common/stylus/variable";
@import "../../common/stylus/mixin";

.suggest
  height: 100%
  overflow: hidden
  .suggest-list
    padding: 0 30px
    .suggest-item
      display: flex
      align-items: center
      padding-bottom: 20px
    .icon
      flex: 0 0 30px
      width: 30px
      [class^="icon-"]
        font-size: 14px
        color: $color-text-d
    .name
      flex: 1
      font-size: $font-size-medium
      color: $color-text-d
      overflow: hidden
      .text
        no-wrap()
  .no-result-wrapper
    position: absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
</style>



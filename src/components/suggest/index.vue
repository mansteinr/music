<template>
  <scroll
    ref="suggest"
    :pullup="pullup"
    class="suggest" 
    :data="result" 
    @scrollToEnd="searchMore">
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
  </scroll>
</template>

<script>
import { search } from '@/api/search'
import { filterSinger } from '@/common/js/song'
import Scroll from '@/base/scroll'

const prepage = 20

export default {
  data() {
    return {
      page: 1,
      result: [],
      pullup: true,
      hasMore: true // 用来判断是否是最后的数据
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
    // 搜索更多
    searchMore() {
      if(!this.hasMore) return
      this.page++
      search(this.query, this.page, this.showSinger, prepage).then(res => {
        this.result = this.result.concat(this.getResult(res.data))
        this.checkMore(res.data)
      })
    },
    search() {
      this.page = 1
      this.hasMore = true
      // 滚到底部
      this.$refs.suggest.scrollTo(0,0, 1000)
      search(this.query, this.page, this.showSinger, prepage).then(res => {
        this.result = this.getResult(res.data)
        this.checkMore(res.data)
      })
    },
    checkMore(list) { // 判断是否是最后的数据
      const song = list.song
      if(!song.list.length || (song.curunm + song.curpage * prepage) > song.totalnum) {
        this.hasMore = false
      }
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
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach((musicData) => {
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  watch: {
    query() {
      this.search()
    }
  },
  components: {
    Scroll
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



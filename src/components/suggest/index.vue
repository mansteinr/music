<template>
  <scroll
    ref="suggest"
    :pullup="pullup"
    class="suggest" 
    :data="result" 
    @scrollToEnd="searchMore">
    <ul class="suggest-list">
      <li @click="selectItem(v)" class="suggest-item" v-for="(v, k) in result" :key="k">
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
import Singer from '@/common/js/singer'
import { mapMutations, mapActions } from 'vuex'
import { createSong, isValidMusic, processSongsUrl } from '@/common/js/song'
 

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
    // 点击打开详情页面
    selectItem(item) {
      if(item.type === 'singer') {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer)
      } else {
        // 提交action
        this.insertSong(item)
      }
      this.$emit('select', item)
    },
    // 搜索更多
    searchMore() {
      if(!this.hasMore) return
      this.page++
      search(this.query, this.page, this.showSinger, prepage).then(res => {
        this.getResult(res.data).then((result) => {
          this.result = result
        })
        this.checkMore(res.data)
      })
    },
    search() {
      this.page = 1
      this.hasMore = true
      // 滚到底部
      this.$refs.suggest.scrollTo(0,0, 1000)
      search(this.query, this.page, this.showSinger, prepage).then(res => {
        this.getResult(res.data).then((result) => {
          this.result = result
        })
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
        return `${value.name}-${value.singer}`
      }
    },
    getResult(data) {
      let ret = []
      if(data.zhida && data.zhida.singerid && this.page === 1) {
        // type 是用来区分是歌手还是歌曲
        ret.push({...data.zhida, ...{type: 'singer'}})
      }
      return processSongsUrl(this._normalizeSongs(data.song.list)).then((songs) => {
        ret = ret.concat(songs)
        return ret
      })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach((musicData) => {
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
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



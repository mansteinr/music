<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <!-- 监听search-box的query事件 -->
        <search-box ref="searchBox" @query="onQueryChange" placeholder="搜索歌曲"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <!-- 监听switch组件的switch事件 -->
        <switches
          @switch="switchItem"
          :switches="switches" 
          :currentIndex="currentIndex"></switches>
          <div class="list-wrapper">
            <scroll ref="songList" class="list-scroll" v-if="currentIndex === 0" :data="playHistory">
              <div class="list-inner">
                <song-list
                  @select="selectSong"
                  :songs="playHistory"></song-list>
              </div>
            </scroll>
            <scroll ref="searchList" class="list-scroll" v-if="currentIndex === 1" :data="searchHistory">
              <div class="list-inner">
                <search-list
                  :searches="searchHistory"
                  @select="addQuery"
                  @deleteItem="deleteItem"></search-list>
              </div>
            </scroll>
          </div>
      </div>
      <div class="searcg-result" v-show="query">
        <suggest 
          :query="query" 
          :showFlag="showFlag"
          @listScroll="blurInput"
          @select="selectSuggest"></suggest>
      </div>
    </div>
  </transition>
</template>

<script>
import Scroll from '@/base/scroll'
import Song from '@/common/js/song'
import Switches from '@/base/switches'
import SongList from '@/base/song-list'
import SearchBox from '@/base/search-box'
import Suggest from '@/components/suggest'
import SearchList from '@/base/search-list'
import { mapGetters, mapActions } from 'vuex'
import { searchMixin } from '@/common/js/mixin'

export default {
  mixins: [ searchMixin ],
  data() {
    return {
      // 不搜索歌手
      showSinger: false,
      showFlag: false,
      currentIndex: 0,
      switches: [
        {name: '最近播放'},
        {name: '搜索历史'},
      ]
    }
  },
  methods: {
    show() {
      this.showFlag = true
      this.refreshList()
    },
    hide() {
      this.showFlag = false
    },
    refreshList () {
      setTimeout(() => {
        if (this.currentIndex === 0) {
          this.$refs.songList.refresh()
        } else {
          this.$refs.searchList.refresh()
        }
      }, 20)
    },
    selectSuggest() {
      this.saveSearch()
    },
    switchItem(index) {
      this.currentIndex = index
    },
    selectSong(song, index) {
      if(index !== 0) {
        // 插入Song的实例
        this.insertSong(new Song(song))
      }
    },
    deleteItem(item) {
      this.deleteSearchHistory(item)
    },
    ...mapActions([
      'insertSong'
    ])
  },
  computed: {
    ...mapGetters([
      'playHistory'
    ])
  },
  components: {
    Scroll,
    Suggest,
    SongList,
    Switches,
    SearchBox,
    SearchList
  }
}
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme

    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>
<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box @query="onQueryChange" ref="searchBox"></search-box>
    </div>
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
      <scroll class="shortcut" :data="shortcut" ref="shortcut">
        <!-- 如果scroll组件包裹两个元素无法定位 所以用一个div包裹起来 -->
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li v-for="v in hotKey" :key="v.n" class="item" @click="addQuery(v)">
                <span>{{ v.k }}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list 
              :searches="searchHistory"
              @select="addQuery"
              @deleteItem="deleteItem"
            ></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest
        ref="suggest"
        @select="saveSearch" 
        @listScroll="blurInput" 
        :query="query"
      ></suggest>
    </div>
    <confirm 
      ref="confirm"
      @confirm="clearSearchHistory"
      ></confirm>
    <router-view></router-view>
  </div>
</template>

<script>
import Suggest from '../suggest'
import Confirm from '@/base/confirm'
import Scroll from '@/base/scroll'
import { getHotKey } from '@/api/search'
import SearchBox from '@/base/search-box'
import SearchList from '@/base/search-list'
import { mapActions } from 'vuex'
import { playlistMixin, searchMixin } from '@/common/js/mixin'

export default {
  mixins: [ playlistMixin, searchMixin ],
  data () {
    return {
      hotKey: [],
      searchHistoryArr: []
    }
  },
  created() {
    this._getHotKey()
   },
  computed: {
    // Scroll组件里面有两个元素 并且有两个异步获取的数据
    // 获取数据的时候 不知道用哪个数据撑开scroll组件
    // 所以用计算属性
    // 也就是说 只要hotkey和searchHistory有一个数据发送改变
    // scroll就会重新计算高度
    shortcut() {
      return this.hotKey.concat(this.searchHistory)
    }
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      
      this.$refs.searchResult.style.bottom = bottom
      // this.$refs.suggest.refresh()
      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.shortcut.refresh()
    },
    showConfirm() {
      this.$refs.confirm.show()
    },
    deleteItem(item) {
      this.deleteSearchHistory(item)
    },
    _getHotKey() {
      getHotKey().then(res => {
        this.hotKey = res.data.hotkey.slice(0, 10)
      })
    },
    ...mapActions([
      'clearSearchHistory'
    ])
  },
  components: {
    SearchList,
    SearchBox,
    Confirm,
    Scroll,
    Suggest
  },
  watch: {
    query(value) {
      // console.log(value)
      if(!value) {
        setTimeout(() => {
          // 重新刷新shortcut组件
          this.$refs.shortcut.refresh()
        }, 20)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable'
@import '../../common/stylus/mixin'
  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>

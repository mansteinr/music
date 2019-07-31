/**
 * 如果在不同的组件中 又相同的逻辑 可以使用mixin
 * 组件的定义的函数会覆盖掉 mixin相同的函数
 * mixin定义和组件很像是 是几个组件共同的逻辑代码
 * 一个组件可以插入多个组件 一旦插入mixin 就将mixin中的代码定义在组件中了
 */

import { playMode } from '@/api/config'
import { shuffle } from '@/common/js/utils'
import { mapGetters, mapMutations, mapActions } from 'vuex'

export const playlistMixin = {
  // 和组件中的mounted一样 dom渲染完成之后触发
  mounted () {
    this.handlePlaylist(this.playList)
  },
  // keep-alive切换时 会触发
  activated () {
    this.handlePlaylist(this.playList)
  },
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  watch: {
    playList (newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist () {
      throw new Error('component must implement handleplaylist')
    }
  }
}
 
export const playerMixin = {
  computed: {
    // 播放模式的图标
    iconMode () {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'sequenceList',
      'playList',
      'currentSong',
      'mode',
      'favoriteList'
    ]),
    favoriteIcon () {
      return this.getFavoriteIcon(this.currentSong)
    }
  },
  methods: {
    // 切换模式
    changeMode() {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if(mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIdnex(list)
      this.setPlayList(list)
    },
   
    // 切换模式的时候 不希望currentIdnex发生改变
    // 当currentIdnex 发生改变时 需要重置currentIdnex
    // 保证切换时歌曲不会发生改变
    resetCurrentIdnex(list) {
      // 当播放模式
      let index = list.findIndex(v => {
        return v.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    toggleFavorite (song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    getFavoriteIcon (song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    isFavorite (song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    ...mapMutations({
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayingState: 'SET_PLAYING_STATE'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ])
  }
}

export const searchMixin = {
  data () {
    return {
      query: '',
      refreshDelay: 120
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    onQueryChange (query) {
      // 处理带空格的情况
      this.query = query.trim()
    },
    blurInput () {
      this.$refs.searchBox.blur()
    },
    addQuery (query) {
      this.$refs.searchBox.setQuery(query)
    },
    saveSearch () {
      this.saveSearchHistory(this.query)
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  }
}

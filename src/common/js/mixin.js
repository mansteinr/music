/**
 * 如果在不同的组件中 又相同的逻辑 可以使用mixin
 * 组件的定义的函数会覆盖掉 mixin相同的函数
 * mixin定义和组件很像是 是几个组件共同的逻辑代码
 * 一个组件可以插入多个组件 一旦插入mixin 就将mixin中的代码定义在组件中了
 */

import { mapGetters } from 'vuex'

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
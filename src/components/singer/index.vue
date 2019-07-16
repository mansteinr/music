<template>
  <div class="singer" ref="singer">
    <list-view @selectItem="selectSinger" :data="singers" ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
import ListView from '@/base/listview'
import Singer from '@/common/js/singer'
import { getSingerList } from '@/api/singer'
import { mapMutations } from 'vuex'
import { playlistMixin } from '@/common/js/mixin'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10 //定义前10条为热门歌曲

export default {
  mixins: [ playlistMixin ],
  data () {
    return {
      singers: []
    }
  },
  created() {
    this._getSingerList()
  },
  components: {
    ListView
  },
  methods: {
        // 这个方法定义在mixin中 可以将mixin中的方法覆盖掉
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.singer.style.bottom = bottom
      // 设置完成之后重新刷新一次
      this.$refs.list.refresh()
    },
    /**
     * 通过mpaMutations将SET_SINGER映射为setSinger
     */
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    selectSinger(v) {
      this.$router.push({
        path: `/singer/${v.id}`
      })
      /**
       * 通过该方法 实现了对mutations的提交
       * 其实就是执行了 mutations.js中的
       * [types.SET_SINGER] (state, singer) {
            state.singer = singer
          }
          函数
       */
      this.setSinger(v)
    },
    _getSingerList() {
      getSingerList().then(res => {
        this.singers = this.normallizeSingr(res.data.list)
      })
    },
    normallizeSingr(list) {
      let map = {
        hot: {
          title: '热门',
          items: []
        }
      }
      list.forEach((v, k) => {
        if(k < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer({
            id: v.Fsinger_mid,
            name: v.Fsinger_name
          }))
        }
        const key = v.Findex
        if(!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        
        map[key].items.push(new Singer({
          id: v.Fsinger_mid,
          name: v.Fsinger_name
        }))
      })
      // map数据序列化
      let hot = [], ret = []
      for(let key in map) {
        if(map[key].title.match(/[a-zA-Z]/)) {
          ret.push(map[key])
        } else if (map[key].title === HOT_NAME) {
          hot.push(map[key])
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return [...hot, ...ret]
    }
  }
}
</script>

<style lang="stylus" scoped>
.singer
  position fixed
  top 87px
  bottom 0
  width 100%
</style>

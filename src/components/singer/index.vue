<template>
  <div class="singer">
    <list-view @selectItem="selectSinger" :data="singers"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
import { getSingerList } from '@/api/singer'
import Singer from '@/common/js/singer'
import ListView from '@/base/listview'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10 //定义前10条为热门歌曲

export default {
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
    selectSinger(v) {
      this.$router.push({
        path: `/singer/${v.id}`
      })
    },
    _getSingerList() {
      let _this = this
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

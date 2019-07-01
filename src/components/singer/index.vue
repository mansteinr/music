<template>
  <div class="singer">
    rer
  </div>
</template>

<script>
import { getSingerList } from '@/api/singer'

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
  methods: {
    _getSingerList() {
      getSingerList().then(res => {
        this.singers = res.data.list
      })
    }
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
        map.hot.items.push({
          id: v.Fsinger_mid,
          name: v.Fsinger_name,
          avatar: `https://y.gtimg.cn/music/photo_new/T001R150x150M000${v.Fsinger_mid}.jpg?max_age=2592000`
        })
      }
      const key = v.Findex
      if(!map[key]) {
        map[key] = {
          title: key,
          items: []
        }
      }
      
    })
  }

}
</script>

<style lang="stylus" scoped>
.singer
  position fixed
  top 88px
  bottom 0
  width 100%
</style>

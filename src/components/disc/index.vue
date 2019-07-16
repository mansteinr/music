<template>
  <transition name="slide">
    <!-- 驼峰命名的 要改成连字符 -->
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSongList } from '@/api/recommend'
import MusicList from '@/components/music-list'
import { createSong, isValidMusic, processSongsUrl } from '@/common/js/song'

export default {
  data() {
    return {
      songs: []
    }
  },
  computed: {
    title() {
      return this.disc.dissname
    },
    bgImage() {
      return this.disc.imgurl
    },
    // 这样就可以拿到state中的disc值
    ...mapGetters([
      'disc'
    ])
  },
  components: {
    MusicList
  },
  created() {
    this._getSongList()
  },
  methods: {
    _getSongList() {
      if(!this.disc.dissid) {
        this.$router.go(-1)
      }
      getSongList(this.disc.dissid).then(res => {
        processSongsUrl(this.normallizeSong(res.cdlist[0].songlist)).then((songs) => {
          this.songs = songs
        })
      })
    },
    normallizeSong(list) {
      let ret = []
      list.forEach(v => {
        if(v.songid && v.albumid) {
          ret.push(createSong(v))
        }
      })
      return ret
    }
  }
}
</script>


<style lang="stylus" scoped>
.slide-enter-active, .slide-leave-active
  transition all .3s

.slide-enter, .slide-leave-to
  transform translate3d(100%, 0, 0)

</style>


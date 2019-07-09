<template>
  <transition name="slide">
    <div class="singer-detail"></div>
  </transition>
</template>

<script>
/**
 * 通过mapGetters去取mutations里面的值
 */
import { mapGetters } from 'vuex'
import { getSingerDetail } from '@/api/singer'
  import { createSong, isValidMusic, processSongsUrl } from '@/common/js/song'

  export default {
    data() {
      return {
        songs: []
      }
    },
    computed: {
      /**
       * mapGetters只能再computed中映射
       * 去取state中的数据
       * 即是getter.sj中的 export const singer = state => state.singer
       */
      ...mapGetters([
        'singer'
      ])
    },
    created() {
      this._singerDetail()
    },
    methods: {
      _singerDetail() {
        if(!this.singer.id) {
          this.$router.push('/singer')
          return
        }
        getSingerDetail(this.singer.id).then(res => {
          processSongsUrl(this.normalizeSongs(res.data.list)).then((songs) => {
            this.songs = songs
            console.log(this.songs)
          })
        })
      },
      normalizeSongs(list) {
        let ret = []
        list.forEach((v, k) => {
          let { musicData } = v
          if (isValidMusic(musicData)) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    }
  }
</script>

<style lang="stylus" scoped>
@import "../../common/stylus/variable"

.singer-detail
  position fixed
  z-index 100
  top 0
  left 0
  right 0
  bottom 0
  background $color-background
.slide-enter-active, .slide-leave-active
  transition all .3s
.slide-enter, .slide-leave-to
  transform translate3d(100%, 0, 0)

</style>



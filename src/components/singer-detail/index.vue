<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script>
/**
 * 通过mapGetters去取mutations里面的值
 */
import { mapGetters } from 'vuex'
import { getSingerDetail } from '@/api/singer'
import MusicList from '@/components/music-list'
import { createSong, isValidMusic, processSongsUrl } from '@/common/js/song'

  export default {
    data() {
      return {
        songs: []
      }
    },
    components: {
      MusicList
    },
    computed: {
      /**
       * mapGetters只能再computed中映射
       * 去取state中的数据
       * 即是getter.sj中的 export const singer = state => state.singer
       */
      ...mapGetters([
        'singer'
      ]),
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      }
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

.slide-enter-active, .slide-leave-active
  transition all .3s
.slide-enter, .slide-leave-to
  transform translate3d(100%, 0, 0)

</style>



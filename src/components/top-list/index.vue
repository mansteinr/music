<template>
  <transition name="slide">
    <music-list :rank="rank" :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getMusicList } from '@/api/rank'
import MusicList from '@/components/music-list'
import { createSong, isValidMusic, processSongsUrl } from '@/common/js/song'

export default {
  data() {
    return{
      songs: [],
      rank: true
    }
  },
  computed: {
    title() {
      return this.topList.topTitle
    },
    bgImage() {
      return this.topList.picUrl
    },
    // 拿到state中的topList数据
    ...mapGetters([
      'topList'
    ])
  },
  components: {
    MusicList
  },
  created() {
    this._getMusicList()
  },
  methods: {
    _getMusicList() {
      if (!this.topList.id) {
        this.$router.push('/rank')
        return
      }
      getMusicList(this.topList.id).then(res => {
        processSongsUrl(this.normalizeSongs(res.songlist)).then((songs) => {
          this.songs = songs
        })
      })
    },
    normalizeSongs (list) {
      let ret = []
      list.forEach((item) => {
        const musicData = item.data
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
    trasition all .3s ease
  
  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>



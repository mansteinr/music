<template>
  <transition name="slide">
    <!-- 驼峰命名的 要改成连字符 -->
    <music-list :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import MusicList from '@/components/music-list'
import { getSongList } from '@/api/recommend'
export default {
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
      getSongList(this.disc.dissid).then(res => {
        console.log(res.cdlist[0].songlist)
      })
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


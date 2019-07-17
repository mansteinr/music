<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import MusicList from '@/components/music-list'
export default {
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
  }
}
</script>

<style lang="stylus" scoped>
  .slide-enter-active, .slide-leave-active
    trasition all .3s ease
  
  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>



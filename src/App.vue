<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
  import Tab from './components/tab'
  import Player from './components/player'
  import MHeader from './components/m-header/m-header'


  export default {
    components: {
      Tab,
      Player,
      MHeader
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  // @import './common/stylus/variable.styl';

  // #app
  //   color $color-theme
</style>

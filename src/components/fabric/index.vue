<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="back">
        <i class="icon-back"></i>
        <h1>Fabric演示</h1>
      </div>
      <div class="fabric">
        <canvas id="canvas"></canvas>
        <ul class="tabs">
          <li>
            <input class="upload-input"  accept="image/*" multiple required type="file" @change="loadImage">
            图片
          </li>
          <li @click="loadTemplate">模板</li>
          <li @click="loadBackground">背景</li>
          <li @click="loadText">文本</li>
          <li @click="loadPaint">画笔</li>
          <li @click="loadPaper">贴纸</li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script>
  import { fabric } from 'fabric'
  export default {
    data () {
      return {
      }
    },
    methods: {
      back () {
        this.$router.back()
      },
      loadImage () {
        console.log('loadImage')
      },
      loadTemplate () {
        console.log('loadTemplate')
      },
      loadBackground () {
        console.log('loadBackground')
      },
      loadPaint () {
        console.log('loadPaint')
      },
      loadText () {
        console.log('loadText')
      },
      loadPaper () {
        console.log('loadPaper')
      }
    },
    mounted() {
      var canvasWrapper = document.querySelector('.fabric')
      var canvas = this.__canvas = new fabric.Canvas('canvas', {
        width: canvasWrapper.offsetWidth,
        height:canvasWrapper.offsetHeight - 40,
        backgroundColor: 'white'
      });
      fabric.Object.prototype.transparentCorners = false;
      var rect = new fabric.Rect({
        left:100,//距离画布左侧的距离，单位是像素
        top:100,//距离画布上边的距离
        fill:'red',//填充的颜色
        width:30,//方形的宽度
        height:30//方形的高度
      })
      canvas.add(rect)
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"

  .user-center
    position: fixed
    top: 0
    bottom: 0
    z-index: 100
    width: 100%
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      display flex
      width 100%
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    h1
      float: left;
      width: 80%;
      text-align: center;
      line-height: 42px;
      color gray
    .fabric
      position: absolute
      top: 42px
      bottom: 0
      width: 100%
      ul
        display flex
        height 40px
        line-height 40px
        background #929090
        li
          flex 1
          position relative
          text-align center
          font-size 12px
          [type="file"]
            position absolute
            width 100%
            height 100%
            left 0
            opacity 0
            font-size 0
</style>
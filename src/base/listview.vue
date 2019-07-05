<template>
  <scroll
    @scroll="scroll"
    :probeType="probeType"
    :listenScroll="listenScroll"
    class="listview" 
    :data = "data" 
    ref="listview">
    <ul>
      <li ref="listGroup" v-for="(v, k) in data" :key="k" class="list-group">
        <h2 class="list-group-title">{{ v.title }}</h2>
        <ul>
          <li @click.stop="selectItem(v1)" v-for="(v1, k1) in v.items" :key="k1" class="list-group-item">
            <img v-lazy="v1.avatar" alt="" class="avatar">
            <span class="name">{{ v1.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- touchstart better-scroll封装好的 -->
    <!-- 阻止冒泡和浏览器滚动 -->
    <div class="list-shortcut" 
      @touchstart.stop.prevent="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
    >
      <ul>
        <li v-for="(v, k) in shotcutList" 
        :key="k" 
        class="item"
        :class="{'current': currentIndex === k}"
        :data-index="k">
          {{ v }}
        </li>
      </ul>
    </div>
    <!-- 固定title -->
     <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{ fixedTitle }}</div>
    </div>
  </scroll>
</template>

<script>
import Scroll from '@/base/scroll'
import { getData } from '@/common/js/dom'

// 锚点的高度 这是通过css定义得来的
const ANCHOR_HEIGHT = 18
// 固定标题的高度
const TITLE_HEIGHT = 30

export default {
  data() {
    return {
      diff: -1,
      scrollY: -1,
      currentIndex: 0
    }
  },
  created() {
    // 这里不需要监听touch值的变化，只是方便各个函数之间
    // 共享方便 所以不需要再再data里面创建
    this.touch = {}
    this.listenScroll = true
    this.lisHeight = []
    // 3 代表可以监听实时滚动
    this.probeType = 3
  },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  components: {
    Scroll
  },
  computed: {
    // 截取快速索引的值
    shotcutList() {
      return this.data.map(v => {
        return v.title.substr(0, 1)
      })
    },
    fixedTitle () {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  methods: {
    selectItem(v) {
      this.$emit('selectItem', v)
    },
    onShortcutTouchStart(e) {
      // 点击时 对应dom的索引 将索引连接起来
      let anchorIndex = getData(e.target, 'index')
      // 记录开始的位置
      this.touch.y1 = e.touches[0].pageY
      // 记录开始时 锚点索引值
      this.touch.anchorIndex = anchorIndex / 1
      this._scrollTo(anchorIndex)
   },
    onShortcutTouchMove(e) {
      // 计算touchStart和touchEnd之间的距离，确定滚动到第几个元素
      this.touch.y2 = e.touches[0].pageY

      // 计算偏移几个锚点 即旁边的索引的高度
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0 // 再y轴上的偏移
      // 后面的|0表示向下取整 相当Math.floor
      // 计算得到滑动结束时  应该滑动到第几个锚点索引
      let anchorIndex = this.touch.anchorIndex / 1 + delta 
      this._scrollTo(anchorIndex)
    },
    _scrollTo(index) {
      if (!index && index !== 0) return
      if(index < 0) {
        index = 0
      } else if(index > this.lisHeight.length -2) {
        index = this.lisHeight.length -2
      }
      this.scrollY = -this.lisHeight[index]
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index/1], 3)
    },
    // 计算左边每个歌手卡片的高度
    _calculateHeight() {
      this.lisHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.lisHeight.push(height)
      // 将第一个开始的高度累加 
      list.forEach(v => {
        height += v.clientHeight
        this.lisHeight.push(height)
      })

    },
    scroll(pos) {
      this.scrollY = pos.y
    }
  },
  watch: {
    data() {
      // 监听data 数据改变之后 
      // dom更新完成之后再重新结算高度
      this.$nextTick(() => {
        this._calculateHeight()
      })
    },
    scrollY(newY) {
      // 通过上限和下限对比 来判断落在哪个区间
      const lisHeight = this.lisHeight
      // console.log(newY, newY > 0)
      // debugger
      // 当滚动到顶部，newY>0
      if (newY > 0) {
        this.currentIndex = 0
        return
      }

      // 在中间部分滚动
      lisHeight.forEach((v, k) => {
        let height1 = v
        let height2 = lisHeight[k + 1]
        // !height2 不存在表示是最后一个
        if(-newY >= height1 && -newY < height2) {
          this.currentIndex = k
          this.diff = height2 + newY // 固定标题到下一个标题之间的距离
          return
        }
      })
      // 滚动到底部
      // this.currentIndex = this.lisHeight.length - 2
    },
    diff(newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      if(this.fixedTop === fixedTop) return // 
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../common/stylus/variable';
 * 
  touch-action pan-y
.listview
  position relative
  width 100%
  height 100%
  overflow hidden
  background $color-background
  .list-group
    padding-bottom 30px
    .list-group-title
      height 30px
      line-height 30px
      padding-left 20px
      font-size $font-size-small
      color $color-text-l
      background $color-heightlight-background
    .list-group-item
      display flex
      align-items center
      padding 20px 0 0 30px
      .avatar
        width 50px
        height 50px
        border-radius 50%
      .name
        margin-left 20px
        color $color-text-l
        font-size $font-size-medium
  .list-shortcut
    position absolute
    z-index 99
    right 0
    top 50%
    transform translateY(-50%)
    width 20px
    padding 20px 0
    border-radius 10px
    text-align center
    background $color-background-d
    font-family Helvetica
    .item
      padding 3px
      line-height: 1
      color: $color-text-l
      font-size: $font-size-small
      &.current
        color: $color-theme
  .list-fixed
    position absolute
    top 0
    left 0
    width 100%
    .fixed-title
      height 30px
      line-height 30px
      padding-left 20px
      font-size $font-size-small
      color $color-text-l
      background $color-highlight-background
</style>



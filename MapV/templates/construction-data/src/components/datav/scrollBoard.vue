<template>
  <div id="scroll-board">
    <dv-scroll-board :config="config" />
  </div>
</template>

<script>
import foo from '../../assets/format.js'
export default {
  name: 'ScrollBoard',
  data () {
    return {
      config: {
        header: ['时间', '事件类别', '发生地点', '危险程度'],
        data: [
          ['<div class="curStyle">' + foo(Date.parse(new Date())) + '</div>', '<a href="http://127.0.0.1:8081/" class="astyle curStyle">枪击事件</a>', '<div class="curStyle">武汉大学桂园四舍</div>', '<div class="curStyle">严重</div>'],
          ['2020-05-15 19:25:00', '<a href="http://127.0.0.1:8081/" class="astyle">爆炸事件</a>', '洪山体育馆', '严重'],
          ['2020-05-16 17:25:00', '<a href="http://127.0.0.1:8081/" class="astyle">燃烧事件</a>', '武汉同济医学院', '严重'],
          ['2020-05-13 16:25:00', '<a href="http://127.0.0.1:8081/" class="astyle">玻璃破碎</a>', '中山公园北门', '轻微'],
          ['2020-05-15 14:25:00', '<a href="http://127.0.0.1:8081/" class="astyle">哭喊事件</a>', '东风汽车公司总部正门', '中等'],
          ['2020-05-16 13:25:00', '<a href="http://127.0.0.1:8081/" class="astyle">爆竹烟花</a>', '黄鹤楼公园', '轻微'],
          ['2020-05-17 12:25:00', '<a href="http://127.0.0.1:8081/" class="astyle">燃烧事件</a>', '武汉木兰天池风景区', '严重'],
          ['2020-05-18 11:25:00', '<a href="http://127.0.0.1:8081/" class="astyle">玻璃破碎</a>', '归元禅寺', '轻微'],
          ['2020-05-14 10:25:00', '<a href="http://127.0.0.1:8081/" class="astyle">枪击事件</a>', '武汉欢乐谷正门', '严重'],
          ['2020-05-10 09:25:00', '<a href="http://127.0.0.1:8081/" class="astyle">爆炸事件</a>', '江汉大学j16教学楼', '中等']
        ],
        index: true,
        columnWidth: [50, 170, 100, 170],
        align: ['center'],
        rowNum: 7,
        headerBGC: '#1981f6',
        headerHeight: 45,
        oddRowBGC: 'rgba(0, 44, 81, 0.8)',
        evenRowBGC: 'rgba(10, 29, 50, 0.8)'
      }
    }
  }
}
</script>

<style lang="less">
#scroll-board {
  width: 50%;
  box-sizing: border-box;
  margin-left: 20px;
  height: 100%;
  overflow: hidden;
}
.astyle {
  text-decoration: none;
  color: white;
}
.curStyle {
  color: red;
  font-weight: bold;
}
</style>

<template>
  <div id="ranking-board">
    <div class="ranking-board-title">识别结果</div>
    <dv-scroll-ranking-board :config="config" />
  </div>
</template>

<script>
export default {
  name: 'RankingBoard',
  data () {
    return {
      config: {
        data: [
          {
            name: '枪击事件',
            value: 0.96
          },
          {
            name: '音乐演奏',
            value: 0.76
          },
          {
            name: '尖叫事件',
            value: 0.71
          },
          {
            name: '警报声响',
            value: 0.25
          },
          {
            name: '爆竹烟花',
            value: 0.12
          },
          {
            name: '燃烧事件',
            value: 0.07
          },
          {
            name: '爆炸事件',
            value: 0.11
          },
          {
            name: '汽车鸣笛',
            value: 0.21
          }
        ],
        rowNum: 8
      }
    }
  }
}
</script>

<style lang="less">
#ranking-board {
  width: 20%;
  box-shadow: 0 0 3px blue;
  display: flex;
  flex-direction: column;
  background-color: rgba(6, 30, 93, 0.5);
  border-top: 2px solid rgba(1, 153, 209, .5);
  box-sizing: border-box;
  padding: 0px 30px;

  .ranking-board-title {
    font-weight: bold;
    height: 50px;
    display: flex;
    align-items: center;
    font-size: 20px;
    margin-top: 15px;
  }

  .dv-scroll-ranking-board {
    flex: 1;
  }
}
</style>

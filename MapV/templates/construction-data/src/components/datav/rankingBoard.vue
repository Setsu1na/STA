<template>
  <div id="ranking-board">
    <div class="ranking-board-title">上报事件数量</div>
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
            name: '警报事件',
            value: 55
          },
          {
            name: '爆竹烟花',
            value: 12
          },
          {
            name: '燃烧事件',
            value: 13
          },
          {
            name: '尖叫事件',
            value: 5
          },
          {
            name: '枪击事件',
            value: 48
          },
          {
            name: '爆炸事件',
            value: 37
          },
          {
            name: '汽车鸣笛',
            value: 29
          },
          {
            name: '哭喊事件',
            value: 32
          },
          {
            name: '玻璃破碎',
            value: 29
          }
        ],
        rowNum: 9
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
  }

  .dv-scroll-ranking-board {
    flex: 1;
  }
}
</style>

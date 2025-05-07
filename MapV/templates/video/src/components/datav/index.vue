<template>
  <div id="data-view">
    <dv-full-screen-container>

      <top-header />

      <div class="main-content">
        <digital-flop />
          <div id="vdd">
            <video id="vd" class="video-js" src="https://beacon-mengxiangjia-dev.oss-cn-shanghai.aliyuncs.com/audioInCity/vedios/biubiubiu.mp4" controls preload="auto" width="1024" height="512" style="height: 720px; width: 1100px;top: 78px; left: 390px;position: fixed">
              Sorry, your browser doesn't support embedded videos.
            </video>
          </div>

        <div class="block-left-right-content">
            <ranking-board />
        </div>
      </div>

    </dv-full-screen-container>
  </div>
</template>

<script>
import topHeader from './topHeader'
import rankingBoard from './rankingBoard'

export default {
  name: 'DataView',
  components: {
    topHeader,
    rankingBoard
  },
  data () {
    return {}
  },
  methods: {}
}
</script>

<style lang="less">
#data-view {
  width: 100%;
  height: 100%;
  background-color: #030409;
  color: #fff;

  #dv-full-screen-container {
    background-image: url('./img/bg.png');
    background-size: 100% 100%;
    box-shadow: 0 0 3px blue;
    display: flex;
    flex-direction: column;
  }

  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .block-left-right-content {
    flex: 1;
    display: flex;
    margin-top: 20px;
    margin-left: 40px;
    margin-bottom: 60px;
  }

}
</style>

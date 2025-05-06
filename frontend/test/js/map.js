// 初始化地图
function initMap() {
    try {
      // 使用更稳定的配置
      map = new AMap.Map('map-container', {
        resizeEnable: true,
        zoom: 11,
        center: [114.298572, 30.584355],
        viewMode: '2D' // 改为2D模式先测试
      });
      
      // 添加一个简单的标记确认地图功能
      var marker = new AMap.Marker({
        position: [114.298572, 30.584355]
      });
      marker.setMap(map);
    } catch (e) {
      console.error("地图初始化错误:", e);
    }
  }
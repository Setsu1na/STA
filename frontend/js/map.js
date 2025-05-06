// 全局地图变量
let map = null;
let districtPolygons = []; // 存储区域多边形
let currentDistrict = null; // 当前选中区域
let districtData = {}; // 存储区域数据

// 预先定义一些区域安全数据，确保有数据可显示
const defaultDistrictSafety = {
  '江岸区': { name: '江岸区', safetyLevel: 2, center: { lng: 114.309963, lat: 30.599835 } },
  '江汉区': { name: '江汉区', safetyLevel: 1, center: { lng: 114.270871, lat: 30.601430 } },
  '硚口区': { name: '硚口区', safetyLevel: 3, center: { lng: 114.214920, lat: 30.582202 } },
  '汉阳区': { name: '汉阳区', safetyLevel: 2, center: { lng: 114.218724, lat: 30.553905 } },
  '武昌区': { name: '武昌区', safetyLevel: 1, center: { lng: 114.316223, lat: 30.554235 } },
  '青山区': { name: '青山区', safetyLevel: 4, center: { lng: 114.391525, lat: 30.639230 } },
  '洪山区': { name: '洪山区', safetyLevel: 3, center: { lng: 114.343913, lat: 30.500365 } },
  '东西湖区': { name: '东西湖区', safetyLevel: 3, center: { lng: 114.137650, lat: 30.619917 } },
  '蔡甸区': { name: '蔡甸区', safetyLevel: 2, center: { lng: 114.087285, lat: 30.582186 } },
  '江夏区': { name: '江夏区', safetyLevel: 5, center: { lng: 114.321551, lat: 30.375748 } },
  '黄陂区': { name: '黄陂区', safetyLevel: 2, center: { lng: 114.375743, lat: 30.882557 } },
  '新洲区': { name: '新洲区', safetyLevel: 3, center: { lng: 114.801096, lat: 30.841544 } },
  '汉南区': { name: '汉南区', safetyLevel: 1, center: { lng: 114.084445, lat: 30.308856 } }
};

// 初始化地图
function initMap() {
  console.log("开始初始化地图...");
  try {
    // 创建地图实例
    map = new AMap.Map('map-container', {
      resizeEnable: true,
      zoom: 10, 
      center: [114.298572, 30.584355], // 武汉市中心
      mapStyle: 'amap://styles/grey', // 使用灰色底图
      features: ['bg', 'building', 'road'], // 仅显示背景、建筑和道路
      viewMode: '2D'
    });
    
    // 隐藏不需要的图层
    map.setFeatures(['bg', 'building', 'road']);
    
    // 隐藏地名标注
    const layers = map.getLayers();
    layers.forEach(layer => {
      if (layer.CLASS_NAME === 'AMap.TileLayer.Traffic' || 
          layer.CLASS_NAME === 'AMap.TileLayer.RoadNet' ||
          layer.CLASS_NAME === 'AMap.TileLayer.Satellite') {
        layer.hide();
      }
    });
    
    // 添加行政区划并支持点击
    addDistrictBoundary();
    
    // 添加事件标记
    setTimeout(addEventMarkers, 1000);
    
    // 初始化事件类型统计（简化版）
    initEventTypeSummary();
    
    // 确保在区域数据加载完成后初始化安全指数
    setTimeout(initSafetyIndex, 2000);
    
    // 更新最新事件提醒
    updateLatestEventAlert();

    // 更新事件预警统计
    updateEventSummary();
  } catch (e) {
    console.error("地图初始化错误:", e);
  }
}

// 添加行政区划边界，支持点击
function addDistrictBoundary() {
  // 加载行政区划插件
  AMap.plugin('AMap.DistrictSearch', function() {
    var districtSearch = new AMap.DistrictSearch({
      level: 'district',  // 查询级别为区县
      subdistrict: 1,     // 返回下一级行政区
      showbiz: false      // 不显示商圈
    });
    
    // 武汉市行政区
    districtSearch.search('武汉市', function(status, result) {
      if (status === 'complete') {
        var districts = result.districtList[0].districtList;
        if (districts && districts.length > 0) {
          districts.forEach((district, index) => {
            var bounds = district.boundaries;
            if (bounds) {
              // 给每个区分配一个安全指数（模拟数据）
              const safetyLevel = Math.floor(Math.random() * 5) + 1; // 1-5
              
              // 存储区域数据
              districtData[district.name] = {
                name: district.name,
                center: district.center,
                safetyLevel: safetyLevel,
                eventCount: Math.floor(Math.random() * 20) // 模拟事件数量
              };
              
              // 绘制区域边界
              var polygon = new AMap.Polygon({
                path: bounds,
                strokeColor: '#3366FF',
                strokeWeight: 2,
                fillColor: getSafetyColor(safetyLevel),
                fillOpacity: 0.3,
                extData: {
                  name: district.name
                }
              });
              
              // 添加点击事件
              polygon.on('click', function() {
                // 切换到该区域视图
                const extData = polygon.getExtData();
                zoomToDistrict(extData.name);
              });
              
              // 添加鼠标悬停事件
              polygon.on('mouseover', function() {
                polygon.setOptions({
                  fillOpacity: 0.5
                });
              });
              
              polygon.on('mouseout', function() {
                polygon.setOptions({
                fillOpacity: 0.3
                });
              });
              
              polygon.setMap(map);
              districtPolygons.push(polygon);
              
              // 添加区名标注
              var center = district.center;
              var text = new AMap.Text({
                text: district.name,
                position: [center.lng, center.lat],
                style: {
                  'background-color': 'transparent',
                  'border': 'none',
                  'color': '#333',
                  'padding': '5px 10px',
                  'font-size': '14px',
                  'font-weight': 'bold'
                },
                extData: {
                  name: district.name
                }
              });
              
              // 给文本标签也添加点击事件
              text.on('click', function() {
                const extData = text.getExtData();
                zoomToDistrict(extData.name);
              });
              
              text.setMap(map);
            }
          });
          
          // 调整视图适合所有行政区
          map.setFitView();
        }
      } else {
        console.error("行政区划查询失败");
      }
    });
  });
}

// 根据安全级别获取颜色
function getSafetyColor(level) {
  const colors = {
    1: '#4cd964', // 安全
    2: '#8cda76', // 较安全
    3: '#ffcc00', // 一般
    4: '#ff9500', // 需注意
    5: '#ff3b30'  // 危险
  };
  return colors[level] || colors[3];
}

// 切换到指定区域
function zoomToDistrict(districtName) {
  // 保存当前选中区域
  currentDistrict = districtName;
  
  // 查找对应的区域数据
  const district = districtData[districtName];
  if (district) {
    // 移动到该区域中心
    map.setCenter([district.center.lng, district.center.lat]);
    map.setZoom(13);
    
    // 更新事件列表，只显示该区域的事件（这里需要模拟）
    const districtEvents = eventsData.filter((event, index) => {
      // 这里简单模拟一下区域筛选，实际应该基于地理位置
      return index % districtPolygons.length === districtPolygons.findIndex(p => p.getExtData().name === districtName);
    });
    
    updateEventList(districtEvents);
  }
}

// 修改：简化事件类型统计，移除事件类型详情
function initEventTypeSummary() {
  const summaryContainer = document.getElementById('event-summary');
  if (!summaryContainer) return;
  
  // 统计各类型事件数量（这里使用模拟数据）
  const eventCounts = {
    red: {
      label: '极敏感事件',
      count: 8
    },
    orange: {
      label: '敏感事件',
      count: 15
    },
    yellow: {
      label: '关注事件',
      count: 27
    },
    blue: {
      label: '普通事件',
      count: 42
    }
  };
  
  // 生成HTML
  let html = '';
  
  // 按严重程度排序显示
  ['red', 'orange', 'yellow', 'blue'].forEach(level => {
    const eventData = eventCounts[level];
    html += `
      <div class="event-type-stat ${level}">
        <div class="event-type">${eventData.label}</div>
        <div class="event-count">${eventData.count}</div>
      </div>
    `;
  });
  
  summaryContainer.innerHTML = html;
}

// 修改区域安全指数初始化函数，确保添加 .safety-grid 容器
function initSafetyIndex() {
  const safetyContainer = document.getElementById('safety-index');
  if (!safetyContainer) {
      console.error("找不到实时安全指数容器");
      return;
  }

  let itemsHtml = ''; // 用于存储内部 safety-item 的 HTML

  // 如果没有区域数据，使用默认数据
  const districts = Object.keys(districtData).length > 0 ?
    districtData : defaultDistrictSafety;

  // 对区域按安全指数排序
  const sortedDistricts = Object.values(districts).sort((a, b) => a.safetyLevel - b.safetyLevel);

  sortedDistricts.forEach(district => {
    // 只生成内部的 item HTML
    itemsHtml += `
      <div class="safety-item level-${district.safetyLevel}" onclick="zoomToDistrict('${district.name}')">
        ${district.name}
        <span class="safety-value">${getSafetyText(district.safetyLevel)}</span>
      </div>
    `;
  });

  // 将生成的 itemsHtml 包裹在 .safety-grid 容器中，然后设置 innerHTML
  safetyContainer.innerHTML = `<div class="safety-grid">${itemsHtml}</div>`;
  console.log("实时安全指数面板更新完成");
}

// 获取安全级别对应的文本
function getSafetyText(level) {
  const texts = {
    1: '安全',
    2: '较安全',
    3: '一般',
    4: '需注意',
    5: '危险'
  };
  return texts[level] || '未知';
}

// 为全局作用域暴露zoomToDistrict函数，使HTML元素可以调用
window.zoomToDistrict = zoomToDistrict;

// 修改添加事件标记的函数，使用全局showEventModal函数
function addEventMarkers() {
  console.log("添加事件标记...");
  try {
    eventsData.forEach(event => {
      // 简化为简单圆点标记
      const markerContent = `
        <div class="simple-marker ${event.level}" style="width: 16px; height: 16px; border-radius: 50%; background-color: ${getColorByLevel(event.level)}; cursor: pointer;"></div>
      `;
      
      // 创建标记
      const marker = new AMap.Marker({
        position: new AMap.LngLat(event.position[0], event.position[1]),
        content: markerContent,
        anchor: 'center',
        offset: new AMap.Pixel(0, 0),
        zIndex: getLevelZIndex(event.level)
      });
      
      marker.setMap(map);
      
      // 绑定点击事件，直接使用简单函数
      marker.on('click', function() {
        console.log("标记被点击", event);
        if (window.showEventModal) {
          window.showEventModal(event);
        } else {
          console.error("showEventModal函数未定义");
          alert("点击了事件: " + event.type);
        }
      });
    });
  } catch (e) {
    console.error("添加标记错误:", e);
  }
}

// 根据事件级别获取颜色
function getColorByLevel(level) {
  const colors = {
    'red': '#ff3b30',
    'orange': '#ff9500',
    'yellow': '#ffcc00',
    'blue': '#007aff',
    'green': '#4cd964'
  };
  return colors[level] || colors.blue;
  }

// 获取级别对应的zIndex，使严重事件显示在上层
function getLevelZIndex(level) {
  const zIndices = {
    'red': 110,
    'orange': 105,
    'yellow': 100,
    'blue': 95,
    'green': 90
  };
  return zIndices[level] || 90;
}

// 更新事件列表
function updateEventList(events) {
  const listEl = document.getElementById("event-list");
  if (!listEl) return;
  
  listEl.innerHTML = "";
  
  events.sort((a, b) => {
    // 按严重程度和时间排序
    const levelOrder = { red: 5, orange: 4, yellow: 3, blue: 2, green: 1 };
    return levelOrder[b.level] - levelOrder[a.level];
  }).forEach(event => {
    const item = document.createElement("div");
    item.className = `event-item ${event.level}`;
    item.innerHTML = `
      <span class="time">${event.time}</span>
      <span class="type">${event.type}</span>
      <span class="description">${event.description}</span>
    `;
    
    // 点击列表项时，地图定位到对应标记
    item.addEventListener('click', () => {
      map.setCenter(event.position);
      map.setZoom(15);
    });
    
    listEl.appendChild(item);
  });
}

// 从事件数据获取边界范围
function getBoundsFromEvents(events) {
  const points = events.map(event => new AMap.LngLat(event.position[0], event.position[1]));
  return new AMap.Bounds(
    new AMap.LngLat(
      Math.min(...points.map(p => p.getLng())) - 0.05,
      Math.min(...points.map(p => p.getLat())) - 0.05
    ),
    new AMap.LngLat(
      Math.max(...points.map(p => p.getLng())) + 0.05,
      Math.max(...points.map(p => p.getLat())) + 0.05
    )
  );
}

// 修改更新最新事件提醒函数
function updateLatestEventAlert() {
  const alertElement = document.getElementById('latest-event-alert');
  if (!alertElement) return;
  
  // 固定提醒内容
  alertElement.innerHTML = "洪山区发生敏感事件：火警警报";
  
  // 设置图标颜色为敏感事件对应的橙色
  const alertIcon = document.querySelector('.alert-icon');
  if (alertIcon) {
    alertIcon.style.backgroundColor = '#ff9500'; // 橙色，对应敏感事件
  }
}

// 在页面加载完成后添加模态窗口事件处理
document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM加载完成，初始化模态窗口");
  
  // 确保模态窗口存在
  const modal = document.getElementById('event-detail-modal');
  if (!modal) {
    console.error("页面中未找到模态窗口元素，动态创建一个");
    
    // 动态创建模态窗口
    const modalHTML = `
      <div id="event-detail-modal" class="modal">
        <div class="modal-content">
          <span class="close-button">&times;</span>
          <div class="modal-header">
            <h2 id="event-title">事件详情</h2>
            <div id="event-time" class="event-time"></div>
          </div>
          <div class="modal-body">
            <div class="detail-left">
              <h3>事件识别概率</h3>
              <div id="probability-chart" class="prob-chart"></div>
              <div class="event-info">
                <div class="info-row">
                  <div class="info-label">事件类型:</div>
                  <div id="event-type" class="info-value"></div>
                </div>
                <div class="info-row">
                  <div class="info-label">事件级别:</div>
                  <div id="event-level" class="info-value"></div>
                </div>
                <div class="info-row">
                  <div class="info-label">事件位置:</div>
                  <div id="event-location" class="info-value"></div>
                </div>
                <div class="info-row">
                  <div class="info-label">处理状态:</div>
                  <div id="event-status" class="info-value"></div>
                </div>
              </div>
              <div class="event-description">
                <h4>详细说明</h4>
                <p id="event-description"></p>
              </div>
            </div>
            <div class="detail-right">
              <h3>实时监控画面</h3>
              <div class="video-container">
                <div id="video-placeholder" class="video-placeholder">
                  <div class="loading-indicator">
                    <div class="spinner"></div>
                    <div class="loading-text">加载监控视频中...</div>
                  </div>
                </div>
              </div>
              <div class="audio-wave-container">
                <h4>音频波形</h4>
                <div class="audio-wave" id="audio-wave-display"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // 添加到页面
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }
});

// 添加通用的createEventDot和getLevelZIndex函数，供历史地图页面调用
window.createEventDot = function(level) {
    const colorMap = {
        'red': '#ff3b30',
        'orange': '#ff9500',
        'yellow': '#ffcc00',
        'blue': '#007aff',
        'green': '#4cd964'
    };
    
    const color = colorMap[level] || colorMap.blue;
    
    return `<div style="width: 16px; height: 16px; background-color: ${color}; border-radius: 50%; box-shadow: 0 0 5px rgba(0,0,0,0.3);"></div>`;
}

window.getLevelZIndex = function(level) {
    const zIndexMap = {
        'red': 110,
        'orange': 105,
        'yellow': 100,
        'blue': 95,
        'green': 90
    };
    
    return zIndexMap[level] || 90;
}

// 更新事件预警统计 - 确保与历史页面样式一致
function updateEventSummary() {
    const summaryContainer = document.getElementById('event-summary');
    if (!summaryContainer) {
        console.error("找不到实时事件统计容器");
        return;
    }

    // 统计各级别事件数量 (包括已处理事件)
    const counts = {
        'red': 0,
        'orange': 0,
        'yellow': 0,
        'blue': 0,
        'green': 0 // 已处理事件
    };

    // 使用全局的 eventsData 进行统计（伪前端）
    // 如果有实时更新的标记列表，可以用那个
    if (typeof eventsData !== 'undefined' && eventsData.length > 0) {
         eventsData.forEach(event => {
             if (event.level && counts.hasOwnProperty(event.level)) {
                counts[event.level]++;
            }
        });
         // 模拟一些已处理事件
         counts['green'] = Math.floor(Math.random() * 5) + 1; // 假设1-5个已处理
    } else {
         // Fallback 模拟数据
         counts.red = Math.floor(Math.random() * 3);
         counts.orange = Math.floor(Math.random() * 8);
         counts.yellow = Math.floor(Math.random() * 15);
         counts.blue = Math.floor(Math.random() * 30);
         counts.green = Math.floor(Math.random() * 5) + 1;
         console.warn("eventsData 未定义或为空, 使用模拟数据进行统计");
    }


    const typeNames = {
        'red': '极敏感事件',
        'orange': '敏感事件',
        'yellow': '关注事件',
        'blue': '普通事件',
        'green': '已处理事件'
    };

    // 计算总事件数 (用于百分比计算，包含已处理)
    const totalEvents = Object.values(counts).reduce((sum, count) => sum + count, 0);
    // 计算活动事件数（不含已处理）
    const totalActiveEvents = totalEvents - counts.green;

    // 生成与历史页面结构一致的HTML
    let html = `
        <div class="event-summary-header">
            <div class="total-count">${totalActiveEvents}</div>
            <div class="total-label">当前活动事件</div>
        </div>
        <div class="event-types">
    `;

    // 按照红、橙、黄、蓝、绿的顺序显示
    ['red', 'orange', 'yellow', 'blue', 'green'].forEach(level => {
        const count = counts[level] || 0;
        // 百分比基于总事件数（含已处理）
        const percent = totalEvents > 0 ? Math.round((count / totalEvents) * 100) : 0;

        html += `
            <div class="event-type-row">
                <span class="dot ${level}"></span>
                <span class="type-name">${typeNames[level]}</span>
                <span class="type-count">${count}</span>
                <span class="type-percent">${percent}%</span>
            </div>
        `;
    });

    html += '</div>';
    summaryContainer.innerHTML = html;
    console.log("实时事件统计更新完成");
}
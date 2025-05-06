// 历史地图页面功能
let historyMap = null;
let historyMapCreated = false; // 跟踪地图是否已创建
let currentHistoryDate = '2025-05-04'; // 默认显示5月4日的数据
let historyEventsMarkers = []; // 存储所有历史事件标记

// 5月4日的事件数据
const events_20250504 = [
  // 极敏感事件（红色）
  {
    id: 101,
    position: [114.253456, 30.635789],
    level: "red",
    type: "燃烧声",
    time: "2025-05-04 21:34:12",
    description: "检测到疑似燃烧声音，消防队已出动"
  },
  {
    id: 110,
    position: [114.298572, 30.584355],
    level: "red",
    type: "爆炸声音",
    time: "2025-05-04 20:15:33",
    description: "检测到疑似爆炸声音，已紧急上报"
  },
  
  // 敏感事件（橙色）
  {
    id: 102,
    position: [114.375689, 30.543210],
    level: "orange",
    type: "大量人群",
    time: "2025-05-04 22:15:33",
    description: "检测到大量人群聚集声音，安保人员已前往查看"
  },
  {
    id: 103,
    position: [114.198765, 30.587654],
    level: "orange",
    type: "烟雾报警器",
    time: "2025-05-04 19:45:21",
    description: "检测到烟雾报警器声音，已通知物业管理员"
  },
  {
    id: 111,
    position: [114.326789, 30.578923],
    level: "orange",
    type: "火警警报",
    time: "2025-05-04 18:23:45",
    description: "检测到火警警报声音，已通知周边建筑"
  },
  
  // 关注事件（黄色）
  {
    id: 104,
    position: [114.432109, 30.621098],
    level: "yellow",
    type: "警笛声",
    time: "2025-05-04 20:56:48",
    description: "检测到警笛声，已记录"
  },
  {
    id: 105,
    position: [114.321098, 30.512345],
    level: "yellow",
    type: "哭泣声",
    time: "2025-05-04 23:12:05",
    description: "检测到哭泣声，已通知社区工作人员"
  },
  {
    id: 112,
    position: [114.276543, 30.567890],
    level: "yellow",
    type: "汽车报警器",
    time: "2025-05-04 21:34:56",
    description: "检测到汽车报警器声音"
  },
  {
    id: 113,
    position: [114.387654, 30.598765],
    level: "yellow",
    type: "尖叫声",
    time: "2025-05-04 22:56:12",
    description: "检测到尖叫声，社区巡逻人员已前往查看"
  },
  
  // 普通事件（蓝色）
  {
    id: 106,
    position: [114.265432, 30.598765],
    level: "blue",
    type: "机械声",
    time: "2025-05-04 18:23:41",
    description: "检测到机械工作声音，可能为附近施工"
  },
  {
    id: 107,
    position: [114.345678, 30.654321],
    level: "blue",
    type: "狗叫声",
    time: "2025-05-04 22:45:10",
    description: "检测到持续狗叫声，正常记录中"
  },
  {
    id: 114,
    position: [114.312345, 30.576543],
    level: "blue",
    type: "引擎声",
    time: "2025-05-04 19:34:23",
    description: "检测到车辆引擎声，正常记录中"
  },
  {
    id: 115,
    position: [114.423456, 30.587654],
    level: "blue",
    type: "普通人声",
    time: "2025-05-04 20:12:34",
    description: "检测到普通人声，正常记录中"
  },
  {
    id: 116,
    position: [114.187654, 30.534567],
    level: "blue",
    type: "动力锯声",
    time: "2025-05-04 17:45:30",
    description: "检测到动力锯声音，可能为园林维护作业"
  },
  
  // 已处理事件（绿色）
  {
    id: 108,
    position: [114.403456, 30.638901],
    level: "green",
    type: "爆炸声音",
    time: "2025-05-04 16:45:23",
    description: "确认为施工爆破声音，已处理完毕"
  },
  {
    id: 109,
    position: [114.229012, 30.525432],
    level: "green",
    type: "火警警报",
    time: "2025-05-04 15:25:47",
    description: "确认为火灾演习，已处理完毕"
  },
  {
    id: 117,
    position: [114.356789, 30.512345],
    level: "green",
    type: "尖叫声",
    time: "2025-05-04 14:56:22",
    description: "确认为儿童游戏声，已处理完毕"
  }
];

// 5月3日的事件数据
const events_20250503 = [
  // 极敏感事件（红色）
  {
    id: 201,
    position: [114.312345, 30.623456],
    level: "red",
    type: "撞击声",
    time: "2025-05-03 23:12:09",
    description: "检测到强烈撞击声音，已紧急上报"
  },
  {
    id: 219,
    position: [114.267890, 30.587654],
    level: "red",
    type: "枪声",
    time: "2025-05-03 22:34:45",
    description: "检测到疑似枪击声音，安保人员已出动"
  },
  
  // 敏感事件（橙色）
  {
    id: 202,
    position: [114.412345, 30.512345],
    level: "orange",
    type: "火警警报",
    time: "2025-05-03 21:23:45",
    description: "检测到火警警报声音，已通知周边建筑"
  },
  {
    id: 220,
    position: [114.356789, 30.593456],
    level: "orange",
    type: "烟雾报警器",
    time: "2025-05-03 19:56:23",
    description: "检测到烟雾报警器声音，已通知物业管理员"
  },
  {
    id: 221,
    position: [114.278901, 30.532145],
    level: "orange",
    type: "大量人群",
    time: "2025-05-03 20:45:12",
    description: "检测到大量人群聚集声音，安保人员已前往查看"
  },
  
  // 关注事件（黄色）
  {
    id: 203,
    position: [114.256789, 30.587654],
    level: "yellow",
    type: "汽车报警器",
    time: "2025-05-03 20:34:12",
    description: "检测到汽车报警器声音"
  },
  {
    id: 204,
    position: [114.334567, 30.623456],
    level: "yellow",
    type: "尖叫声",
    time: "2025-05-03 22:45:56",
    description: "检测到尖叫声，社区巡逻人员已前往查看"
  },
  {
    id: 222,
    position: [114.432109, 30.578901],
    level: "yellow",
    type: "警笛声",
    time: "2025-05-03 21:12:34",
    description: "检测到警笛声，已记录"
  },
  {
    id: 223,
    position: [114.312098, 30.545678],
    level: "yellow",
    type: "哭泣声",
    time: "2025-05-03 23:45:10",
    description: "检测到哭泣声，已通知社区工作人员"
  },
  
  // 普通事件（蓝色）
  {
    id: 205,
    position: [114.287654, 30.534567],
    level: "blue",
    type: "引擎声",
    time: "2025-05-03 19:23:45",
    description: "检测到车辆引擎声，正常记录中"
  },
  {
    id: 206,
    position: [114.365432, 30.598765],
    level: "blue",
    type: "普通人声",
    time: "2025-05-03 18:12:34",
    description: "检测到普通人声，正常记录中"
  },
  {
    id: 224,
    position: [114.234567, 30.567890],
    level: "blue",
    type: "机械声",
    time: "2025-05-03 17:56:23",
    description: "检测到机械工作声音，可能为附近施工"
  },
  {
    id: 225,
    position: [114.387654, 30.623456],
    level: "blue",
    type: "狗叫声",
    time: "2025-05-03 20:34:56",
    description: "检测到持续狗叫声，正常记录中"
  },
  {
    id: 226,
    position: [114.312456, 30.534567],
    level: "blue",
    type: "汽车喇叭",
    time: "2025-05-03 18:45:23",
    description: "检测到汽车喇叭声，正常记录中"
  },
  
  // 已处理事件（绿色）
  {
    id: 227,
    position: [114.376543, 30.554321],
    level: "green",
    type: "爆炸声音",
    time: "2025-05-03 15:23:45",
    description: "确认为施工爆破声音，已处理完毕"
  },
  {
    id: 228,
    position: [114.256789, 30.598765],
    level: "green",
    type: "火警警报",
    time: "2025-05-03 14:45:12",
    description: "确认为火灾演习，已处理完毕"
  }
];

// 修改显示历史地图函数，确保内容正确加载
function showHistoryMap() {
  console.log("显示历史地图");
  
  if (!historyMapCreated) {
    console.log("历史地图尚未创建，初始化");
    initHistoryMap();
    return;
  }
  
  // 确保地图显示正确
  if (historyMap) {
    // 延迟执行，确保DOM完全更新
    setTimeout(function() {
      console.log("重置历史地图视图");
      historyMap.setZoom(10);
      historyMap.setCenter([114.298572, 30.584355]);
      
      // 刷新事件显示
      clearHistoryMarkers();
      const events = currentHistoryDate === '2025-05-04' ? events_20250504 : events_20250503;
      displayHistoryEvents(events);
      
      // 重新初始化日历事件
      initCalendarDateSelectors();
      
      // 重新初始化右侧面板内容
      updateHistoryEventSummary(currentHistoryDate);
      updateHistorySafetyIndex(currentHistoryDate);
    }, 100);
  }
}

// 修改初始化日历的函数，让1-4日和4月日期都可点击且视觉一致
function initCalendarDateSelectors() {
  console.log("初始化日历日期选择器");
  
  // 为所有日期添加适当的样式和事件
  document.querySelectorAll('.calendar-day').forEach(function(day) {
    const dayText = day.textContent.trim();
    const dayNum = parseInt(dayText);
    
    // 清除已有事件
    day.removeEventListener('click', calendarDayClickHandler);
    
    // 跳过表头
    if (day.classList.contains('day-header')) return;
    
    // 对不同日期进行分类
    if (day.classList.contains('day-disabled')) {
      // 5日后不可点击
      // 无需添加点击事件
    } else {
      // 1-4日和4月日期都可点击
      day.addEventListener('click', calendarDayClickHandler);
    }
  });
  
  // 确保当前日期高亮显示
  document.querySelectorAll('.day-selectable').forEach(function(day) {
    if (day.getAttribute('data-date') === currentHistoryDate) {
      day.classList.add('active');
    } else {
      day.classList.remove('active');
    }
  });
}

// 日历日期点击处理函数
function calendarDayClickHandler() {
  // 如果是不可点击的日期，直接返回
  if (this.classList.contains('day-disabled')) {
    return;
  }
  
  const dateValue = this.getAttribute('data-date');
  const dayNumber = this.textContent.trim();
  
  console.log("点击日期:", dayNumber, "data-date:", dateValue);
  
  // 如果是3日或4日，有实际效果
  if (dateValue === '2025-05-03' || dateValue === '2025-05-04') {
    // 更新高亮显示
    document.querySelectorAll('.day-selectable').forEach(function(day) {
      day.classList.remove('active');
    });
    this.classList.add('active');
    
    // 更新当前日期
    currentHistoryDate = dateValue;
    
    // 加载对应日期的事件
    const events = dateValue === '2025-05-04' ? events_20250504 : events_20250503;
    
    // 清除现有标记并显示新事件
    clearHistoryMarkers();
    displayHistoryEvents(events);
    
    // 更新右侧面板
    updateHistoryEventSummary(events);
    updateHistorySafetyIndex(dateValue);
  } else {
    // 其他日期点击只显示提示，不做实际操作
    console.log("该日期无历史数据");
    
    // 可以添加一个轻微的视觉反馈
    const originalBg = this.style.backgroundColor;
    this.style.backgroundColor = '#e0e0e0';
    setTimeout(() => {
      this.style.backgroundColor = originalBg;
    }, 300);
  }
}

// 更新历史事件统计，增加统计数量
function updateHistoryEventSummary(events) {
  console.log("更新历史事件统计");
  
  const summaryContainer = document.getElementById('history-summary');
  if (!summaryContainer) {
    console.error("未找到history-summary容器");
    return;
  }
  
  // 增加统计数量（不需要与地图上的点对应）
  let counts;
  
  if (currentHistoryDate === '2025-05-04') {
    counts = {
      red: 12,     // 增加数量
      orange: 25,  // 增加数量
      yellow: 34,  // 增加数量
      blue: 56,    // 增加数量
      green: 18    // 增加数量
    };
  } else if (currentHistoryDate === '2025-05-03') {
    counts = {
      red: 8,      // 增加数量
      orange: 19,  // 增加数量
      yellow: 27,  // 增加数量
      blue: 42,    // 增加数量
      green: 13    // 增加数量
    };
  } else {
    // 默认数量
    counts = {
      red: 0,
      orange: 0,
      yellow: 0,
      blue: 0,
      green: 0
    };
  }
  
  // 生成HTML
  let html = '';
  
  // 按严重程度排序显示
  ['red', 'orange', 'yellow', 'blue', 'green'].forEach(level => {
    const levelNames = {
      'red': '极敏感事件',
      'orange': '敏感事件',
      'yellow': '关注事件',
      'blue': '普通事件',
      'green': '已处理事件'
    };
    
    html += `
      <div class="event-type-stat ${level}">
        <div class="event-type">${levelNames[level]}</div>
        <div class="event-count">${counts[level]}</div>
      </div>
    `;
  });
  
  // 更新DOM
  summaryContainer.innerHTML = html;
  console.log("更新历史事件统计完成");
}

// 更新区域安全指数，确保内容正确显示
function updateHistorySafetyIndex(date) {
  console.log("更新区域安全指数");
  
  const safetyContainer = document.getElementById('history-safety-index');
  if (!safetyContainer) {
    console.error("未找到history-safety-index容器");
    return;
  }
  
  // 所有区域数据
  const districtData = {
    '江岸区': { name: '江岸区', safetyLevel: 3 },
    '江汉区': { name: '江汉区', safetyLevel: 2 },
    '硚口区': { name: '硚口区', safetyLevel: 2 },
    '汉阳区': { name: '汉阳区', safetyLevel: 1 },
    '武昌区': { name: '武昌区', safetyLevel: 3 },
    '青山区': { name: '青山区', safetyLevel: 4 },
    '洪山区': { name: '洪山区', safetyLevel: 5 },
    '东西湖区': { name: '东西湖区', safetyLevel: 3 },
    '蔡甸区': { name: '蔡甸区', safetyLevel: 2 },
    '江夏区': { name: '江夏区', safetyLevel: 4 },
    '黄陂区': { name: '黄陂区', safetyLevel: 2 },
    '新洲区': { name: '新洲区', safetyLevel: 3 },
    '汉南区': { name: '汉南区', safetyLevel: 1 }
  };
  
  // 根据日期修改部分区域安全级别
  if (date === '2025-05-03') {
    districtData['江岸区'].safetyLevel = 2;
    districtData['江汉区'].safetyLevel = 3;
    districtData['武昌区'].safetyLevel = 4;
    districtData['洪山区'].safetyLevel = 3;
    districtData['黄陂区'].safetyLevel = 3;
    districtData['新洲区'].safetyLevel = 4;
  }
  
  // 生成HTML
  let html = '';
  
  // 对区域按安全指数排序
  const sortedDistricts = Object.values(districtData).sort((a, b) => a.safetyLevel - b.safetyLevel);
  
  sortedDistricts.forEach(district => {
    const safetyTexts = ['', '安全', '较安全', '一般', '需注意', '危险'];
    
    html += `
      <div class="safety-item level-${district.safetyLevel}">
        ${district.name}
        <span class="safety-value">${safetyTexts[district.safetyLevel]}</span>
      </div>
    `;
  });
  
  // 更新DOM
  safetyContainer.innerHTML = html;
  console.log("更新区域安全指数完成");
}

// 修改初始化函数，为所有日期添加data-date属性
function initHistoryMap(silent = false) {
  console.log("开始初始化历史地图, silent:", silent);
  
  // 如果已经创建，直接返回
  if (historyMapCreated) {
    console.log("历史地图已创建，不再重复初始化");
    return;
  }
  
  // 获取地图容器
  const mapContainer = document.getElementById('history-map-container');
  if (!mapContainer) {
    console.error("找不到地图容器");
    return;
  }
  
  try {
    // 使用简化配置创建地图
    historyMap = new AMap.Map(mapContainer, {
      resizeEnable: true,
      dragEnable: true,
      zoomEnable: true,
      center: [114.298572, 30.584355],
      zoom: 10,
      zooms: [9, 16], // 限制缩放级别范围
      mapStyle: 'amap://styles/grey',
      viewMode: '2D',
      features: ['bg', 'road'], // 只显示背景和道路
      showIndoorMap: false,
      showBuildingBlock: false
    });
    
    console.log("历史地图创建成功");
    historyMapCreated = true;
    
    // 添加事件处理
    historyMap.on('complete', function() {
      console.log("历史地图加载完成");
      
      // 为所有日历日期添加data-date属性
      addDataDateToAllCalendarDays();
      
      // 强制设置缩放级别
      historyMap.setZoom(10);
      
      // 如果是静默初始化，不加载内容
      if (silent) {
        console.log("静默初始化，不加载内容");
        return;
      }
      
      // 添加区域标签
      addDistrictLabels();
      
      // 加载事件数据
      displayHistoryEvents(events_20250504);
      
      // 初始化日期选择器事件 - 直接绑定简单点击事件
      document.querySelectorAll('.day-selectable').forEach(function(day) {
        day.addEventListener('click', dateClickHandler);
      });
      
      // 显示当前选中日期
      document.querySelectorAll('.day-selectable').forEach(function(day) {
        if (day.getAttribute('data-date') === currentHistoryDate) {
          day.classList.add('active');
        } else {
          day.classList.remove('active');
        }
      });
      
      // 更新事件统计和区域安全指数
      updateHistoryEventSummary(events_20250504);
      updateHistorySafetyIndex('2025-05-04');
    });
    
    // 禁用自动适应视图
    historyMap.setFitView = function() {
      // 空函数，禁用自动适应视图
    };
  } catch (e) {
    console.error("初始化历史地图时出错:", e);
  }
}

// 修改日期数据属性初始化函数
function addDataDateToAllCalendarDays() {
  // 获取所有日期单元格
  const dayElements = document.querySelectorAll('.calendar-day:not(.day-header)');
  
  // 设置5月的起始日
  dayElements.forEach(function(day, index) {
    const dayNumber = day.textContent.trim();
    const dayInt = parseInt(dayNumber);
    
    // 跳过表头和非数字内容
    if (isNaN(dayInt)) return;
    
    // 根据天数判断月份
    let month = 5; // 默认5月
    if (dayInt > 20) month = 4; // 27-31是4月
    
    // 设置data-date属性
    const dateString = `2025-${month.toString().padStart(2, '0')}-${dayInt.toString().padStart(2, '0')}`;
    day.setAttribute('data-date', dateString);
  });
}

// 添加区域标签
function addDistrictLabels() {
  // 武汉市各区中心点位置（大致位置）
  const districts = [
    { name: "江岸区", position: [114.309963, 30.599835] },
    { name: "江汉区", position: [114.270871, 30.601430] },
    { name: "硚口区", position: [114.214920, 30.582202] },
    { name: "汉阳区", position: [114.218724, 30.553905] },
    { name: "武昌区", position: [114.316223, 30.554235] },
    { name: "青山区", position: [114.391525, 30.639230] },
    { name: "洪山区", position: [114.343913, 30.500365] },
    { name: "东西湖区", position: [114.137650, 30.619917] },
    { name: "蔡甸区", position: [114.087285, 30.582186] },
    { name: "江夏区", position: [114.321551, 30.375748] },
    { name: "黄陂区", position: [114.375743, 30.882557] },
    { name: "新洲区", position: [114.801096, 30.841544] }
  ];
  
  // 添加区域名称标签
  districts.forEach(district => {
    const text = new AMap.Text({
      text: district.name,
      position: new AMap.LngLat(district.position[0], district.position[1]),
      style: {
        'background-color': 'transparent',
        'border': 'none',
        'color': '#333',
        'font-size': '14px',
        'font-weight': 'bold',
        'padding': '5px 10px',
        'text-shadow': '1px 1px 2px rgba(255,255,255,0.8)'
      }
    });
    
    text.setMap(historyMap);
  });
}

// 清除历史标记，保留区域标签
function clearHistoryMarkers() {
  historyEventsMarkers.forEach(marker => {
    marker.setMap(null);
  });
  historyEventsMarkers = [];
}

// 显示历史事件
function displayHistoryEvents(events) {
  console.log("显示历史事件, 数量:", events.length);
  
  if (!historyMap) return;
  
  // 强制设置缩放级别，防止自动缩放
  historyMap.setZoom(10);
  
  events.forEach(event => {
    // 创建标记
    const markerContent = `
      <div class="simple-marker ${event.level}" style="width: 16px; height: 16px; border-radius: 50%; background-color: ${getColorByLevel(event.level)}; cursor: pointer;"></div>
    `;
    
    const marker = new AMap.Marker({
      position: new AMap.LngLat(event.position[0], event.position[1]),
      content: markerContent,
      anchor: 'center',
      offset: new AMap.Pixel(0, 0),
      zIndex: getLevelZIndex(event.level)
    });
    
    marker.setMap(historyMap);
    historyEventsMarkers.push(marker);
    
    marker.on('click', function() {
      if (window.showEventModal) {
        window.showEventModal(event);
      }
    });
  });
  
  // 不使用setFitView，保持固定缩放级别
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

// 获取级别对应的zIndex
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

// 修改页面导航控制，确保历史地图页面正确初始化
document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM加载完成，初始化导航");
  
  // 直接添加一个特定的初始化函数，确保历史地图正确加载
  const historyMapInit = function() {
    console.log("尝试初始化历史地图");
    const historyPage = document.getElementById('history-page');
    if (historyPage) {
      const mapContainer = document.getElementById('history-map-container');
      if (mapContainer) {
        // 确保容器显示正确
        mapContainer.style.width = '100%';
        mapContainer.style.height = '100vh';
        
        // 初始化历史地图
        if (typeof initHistoryMap === 'function') {
          setTimeout(initHistoryMap, 100);
        }
      }
    }
  };
  
  // 监听导航链接点击
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(link => {
    link.addEventListener("click", function(e) {
      e.preventDefault();
      
      // 获取目标页面ID
      const pageId = this.getAttribute("data-page") + "-page";
      console.log("切换到页面:", pageId);
      
      // 如果是历史页面，确保地图初始化
      if (pageId === "history-page") {
        setTimeout(historyMapInit, 300);
      }
      
      // 标准的页面切换逻辑
      navLinks.forEach(item => item.classList.remove("active"));
      document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
      
      this.classList.add("active");
      const targetPage = document.getElementById(pageId);
      if (targetPage) {
        targetPage.classList.add("active");
      }
    });
  });
  
  // 如果当前在历史页面，立即初始化
  const historyPage = document.getElementById('history-page');
  if (historyPage && historyPage.classList.contains('active')) {
    console.log("当前在历史页面，立即初始化地图");
    setTimeout(historyMapInit, 300);
  }
});
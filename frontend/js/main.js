// 页面导航控制
document.addEventListener("DOMContentLoaded", function() {
    console.log("主脚本初始化");
    
    // 初始化导航
    initNavigation();
    
    // 初始化实时地图
    if(document.getElementById('map-container')) {
        initMap();
    }
    
    // 初始化日报页面
    if(document.getElementById('report-page')) {
        setTimeout(function() {
            console.log("初始化日报系统页面");
            if(typeof initSafetyIndexReport === 'function') {
                initSafetyIndexReport();
                initMonthlyEventChart();
                initYearlyTrendChart();
                enhanceAlertDisplay();
                enhanceImportantEvents();
            }
        }, 300);
    }
    
    // 立即执行一次历史地图页面检查
    setTimeout(checkAndInitHistoryMap, 500);
});

// 导航切换功能
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
        e.preventDefault();
            
            // 移除所有激活状态
            navLinks.forEach(item => item.classList.remove('active'));
            document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
            
            // 添加当前项的激活状态
            this.classList.add('active');
            
            // 显示对应页面
            const pageId = this.getAttribute('data-page') + '-page';
            const targetPage = document.getElementById(pageId);
            
            if(targetPage) {
                targetPage.classList.add('active');
                
                // 根据页面类型初始化不同功能
                if(pageId === 'real-time-page') {
                    // 实时地图页面
                    setTimeout(() => {
                        if(window.map) {
                            window.map.resize();
                        } else {
                            initMap();
                        }
                    }, 100);
                } 
                else if(pageId === 'history-page') {
                    // 历史地图页面
                    console.log("切换到历史地图页面");
                    setTimeout(() => {
                        if(!window.historyMap) {
                            if(typeof initHistoryMap === 'function') {
                                initHistoryMap();
                            } else {
                                console.error("历史地图初始化函数不存在");
                            }
                        } else {
                            if(window.historyMap.resize) {
                                window.historyMap.resize();
                            }
                            
                            // 重新加载当前日期的数据
                            if(typeof loadHistoryEvents === 'function' && 
                               typeof updateHistoryEventSummary === 'function' && 
                               typeof updateHistorySafetyIndex === 'function' &&
                               window.currentHistoryDate) {
                                   
                                loadHistoryEvents(window.currentHistoryDate);
                                updateHistoryEventSummary(window.currentHistoryDate);
                                updateHistorySafetyIndex(window.currentHistoryDate);
                            }
                        }
                    }, 300);
                }
                else if(pageId === 'report-page') {
                    // 日报系统页面
                    console.log("切换到日报系统页面");
                    setTimeout(function() {
                        if(typeof initSafetyIndexReport === 'function') {
                            initSafetyIndexReport();
                            initMonthlyEventChart();
                            initYearlyTrendChart();
                            enhanceAlertDisplay();
                            enhanceImportantEvents();
                        } else {
                            console.error("日报系统初始化函数未定义");
                        }
                    }, 300);
                }
            }
        });
    });
}

// 暴露给全局
window.initNavigation = initNavigation;

// 检查并初始化历史地图
function checkAndInitHistoryMap() {
    console.log("检查并初始化历史地图");
    
    // 如果历史地图页面是当前活动页面
    if(document.getElementById('history-page').classList.contains('active')) {
        console.log("历史地图页面处于活动状态");
        
        // 初始化历史地图
        if(window.historyMap) {
            console.log("历史地图已存在，执行刷新");
            window.historyMap.resize();
            
            // 手动填充历史事件统计数据
            fillHistoryEventSummary();
            
            // 手动填充历史安全指数数据  
            fillHistorySafetyIndex();
            
            // 重新绑定日期选择
            bindHistoryDateSelection();
        }
        else {
            console.log("创建新的历史地图");
            
            // 创建历史地图
            createHistoryMap();
            
            // 手动填充历史事件统计数据
            fillHistoryEventSummary();
            
            // 手动填充历史安全指数数据
            fillHistorySafetyIndex();
            
            // 绑定日期选择
            bindHistoryDateSelection();
        }
    }
}

// 创建历史地图
function createHistoryMap() {
    console.log("创建历史地图");
    const historyMapContainer = document.getElementById('history-map-container');
    
    if(!historyMapContainer) {
        console.error("历史地图容器不存在");
        return;
    }
    
    // 创建地图实例
    window.historyMap = new AMap.Map('history-map-container', {
        resizeEnable: true,
        zoom: 12,
        center: [114.3162, 30.5981], // 武汉市中心
        viewMode: '3D',
        mapStyle: 'amap://styles/whitesmoke'
    });
    
    // 禁用缩放条控件
    window.historyMap.plugin(['AMap.Scale'], function() {
        // 不添加缩放控件
    });
    
    // 添加区域名称
    addHistoryDistrictLabels();
    
    // 添加事件标记
    addHistoryEventMarkers();
}

// 添加历史事件标记
function addHistoryEventMarkers() {
    if(!window.historyMap) return;
    
    // 清除已有标记
    if(window.historyMarkers) {
        window.historyMarkers.forEach(marker => {
            marker.setMap(null);
        });
    }
    
    window.historyMarkers = [];
    
    // 模拟事件数据
    const events = [
        { id: 101, position: [114.288572, 30.564355], type: "火警警报", level: "orange", time: "14:23:45", description: "检测到建筑火警报警器声音，持续时间约25秒。" },
        { id: 102, position: [114.308572, 30.594355], type: "汽车报警器", level: "yellow", time: "12:15:30", description: "检测到汽车防盗报警器声音，持续约40秒。" },
        { id: 103, position: [114.328572, 30.574355], type: "狗叫", level: "blue", time: "20:45:12", description: "检测到持续狗叫声，持续约3分钟。" },
        { id: 104, position: [114.268572, 30.564355], type: "引擎声", level: "blue", time: "23:30:45", description: "检测到大型车辆引擎声，持续约2分钟。" },
        { id: 105, position: [114.348572, 30.534355], type: "警笛声", level: "yellow", time: "18:10:24", description: "检测到警车警笛声，经过路口。" },
        { id: 106, position: [114.298572, 30.604355], type: "尖叫", level: "yellow", time: "22:40:33", description: "检测到人群尖叫声，可能是娱乐场所。" },
        { id: 107, position: [114.278572, 30.544355], type: "汽车喇叭", level: "blue", time: "17:25:18", description: "检测到密集汽车喇叭声，可能是交通拥堵。" }
    ];
    
    // 添加事件标记到地图
    events.forEach(event => {
        const marker = new AMap.Marker({
            position: event.position,
            content: createHistoryEventDot(event.level),
            offset: new AMap.Pixel(-8, -8),
            zIndex: getHistoryLevelZIndex(event.level),
            extData: event
        });
        
        marker.on('click', function() {
            showEventModal(event);
        });
        
        marker.setMap(window.historyMap);
        window.historyMarkers.push(marker);
    });
}

// 创建历史事件点图标
function createHistoryEventDot(level) {
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

// 获取历史事件级别的z-index值
function getHistoryLevelZIndex(level) {
    const zIndexMap = {
        'red': 110,
        'orange': 105,
        'yellow': 100,
        'blue': 95,
        'green': 90
    };
    
    return zIndexMap[level] || 90;
}

// 添加历史地图区域名称标签
function addHistoryDistrictLabels() {
    if(!window.historyMap) return;
    
    const districts = [
        { name: "江岸区", position: [114.3162, 30.6149] },
        { name: "江汉区", position: [114.2709, 30.6015] },
        { name: "硚口区", position: [114.2148, 30.5702] },
        { name: "汉阳区", position: [114.2278, 30.5546] },
        { name: "武昌区", position: [114.3162, 30.5542] },
        { name: "青山区", position: [114.3897, 30.6340] },
        { name: "洪山区", position: [114.3432, 30.5197] },
        { name: "东西湖区", position: [114.1377, 30.6200] },
        { name: "蔡甸区", position: [114.0294, 30.5822] },
        { name: "江夏区", position: [114.3212, 30.3759] },
        { name: "黄陂区", position: [114.3751, 30.8822] },
        { name: "新洲区", position: [114.8013, 30.8414] },
        { name: "汉南区", position: [114.0846, 30.3087] }
    ];
    
    districts.forEach(district => {
        const textMarker = new AMap.Text({
            text: district.name,
            position: district.position,
            style: {
                'background-color': 'transparent',
                'border-width': 0,
                'text-align': 'center',
                'font-size': '14px',
                'color': '#333',
                'font-weight': 'bold'
            },
            offset: new AMap.Pixel(0, 0),
            zIndex: 80
        });
        
        textMarker.setMap(window.historyMap);
    });
}

// 手动填充历史事件统计数据
function fillHistoryEventSummary() {
    console.log("填充历史事件统计数据");
    
    const summaryContainer = document.getElementById('history-summary');
    if (!summaryContainer) {
        console.error("找不到历史事件统计容器");
        return;
    }
    
    const eventCounts = {
        'red': 0,
        'orange': 1,
        'yellow': 3,
        'blue': 3,
        'green': 0
    };
    
    // 生成HTML统计内容
    const typeNames = {
        'red': '极敏感事件',
        'orange': '敏感事件',
        'yellow': '关注事件',
        'blue': '普通事件',
        'green': '已处理事件'
    };
    
    const colorMap = {
        'red': '#ff3b30',
        'orange': '#ff9500',
        'yellow': '#ffcc00',
        'blue': '#007aff',
        'green': '#4cd964'
    };
    
    let html = '';
    Object.keys(typeNames).forEach(level => {
        const count = eventCounts[level] || 0;
        html += `
            <div class="event-type" style="display: flex; align-items: center; margin-bottom: 10px;">
                <div class="type-dot" style="width: 12px; height: 12px; border-radius: 50%; margin-right: 10px; background-color: ${colorMap[level]};"></div>
                <div class="type-name" style="flex: 1;">${typeNames[level]}</div>
                <div class="type-count" style="font-weight: bold; font-size: 16px;">${count}</div>
            </div>
        `;
    });
    
    summaryContainer.innerHTML = html;
}

// 手动填充历史安全指数数据
function fillHistorySafetyIndex() {
    console.log("填充历史安全指数数据");
    
    const safetyContainer = document.getElementById('history-safety-index');
    if (!safetyContainer) {
        console.error("找不到历史安全指数容器");
        return;
    }
    
    const districtData = {
        '江岸区': { safetyLevel: 3 },
        '江汉区': { safetyLevel: 2 },
        '硚口区': { safetyLevel: 2 },
        '汉阳区': { safetyLevel: 1 },
        '武昌区': { safetyLevel: 3 },
        '青山区': { safetyLevel: 4 },
        '洪山区': { safetyLevel: 5 },
        '东西湖区': { safetyLevel: 3 },
        '蔡甸区': { safetyLevel: 2 },
        '江夏区': { safetyLevel: 4 },
        '黄陂区': { safetyLevel: 2 },
        '新洲区': { safetyLevel: 3 },
        '汉南区': { safetyLevel: 1 }
    };
    
    // 安全等级说明文字
    const safetyTexts = ['', '安全', '较安全', '一般', '需注意', '危险'];
    
    // 生成HTML，两列布局
    let html = '<div style="display: flex; flex-wrap: wrap;">';
    
    // 按区名排序区域列表
    const sortedDistricts = Object.keys(districtData).sort();
    
    sortedDistricts.forEach((district, index) => {
        const level = districtData[district].safetyLevel;
        
        const bgColors = ['', 
            'rgba(76, 217, 100, 0.2)', // 安全
            'rgba(76, 217, 100, 0.1)', // 较安全
            'rgba(255, 204, 0, 0.1)',  // 一般
            'rgba(255, 149, 0, 0.1)',  // 需注意
            'rgba(255, 59, 48, 0.1)'   // 危险
        ];
        
        html += `
            <div style="width: 50%; padding: 5px; box-sizing: border-box;">
                <div style="display: flex; justify-content: space-between; padding: 5px 10px; margin-bottom: 5px; border-radius: 4px; font-size: 14px; background-color: ${bgColors[level]}">
                    ${district}
                    <span>${safetyTexts[level]}</span>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    safetyContainer.innerHTML = html;
}

// 绑定历史日期选择事件
function bindHistoryDateSelection() {
    console.log("绑定历史日期选择事件");
    
    // 当前选中的日期
    window.currentHistoryDate = "2025-05-04";
    
    // 处理日期点击
    document.querySelectorAll('.calendar-day.day-selectable').forEach(day => {
        day.addEventListener('click', function() {
            const selectedDate = this.getAttribute('data-date');
            if (selectedDate) {
                console.log("选择新日期:", selectedDate);
                
                // 更新激活状态
                document.querySelectorAll('.calendar-day').forEach(day => {
                    day.classList.remove('active');
                });
                this.classList.add('active');
                
                // 更新当前日期
                window.currentHistoryDate = selectedDate;
                
                // 根据日期更新地图事件
                if (selectedDate === "2025-05-03") {
                    // 添加5月3日事件
                    updateHistoryMapToMay3();
                } else {
                    // 默认显示5月4日事件
                    updateHistoryMapToMay4();
          }
        }
      });
    });
    
    // 处理其他可点击但无效果的日期
    document.querySelectorAll('.calendar-day.day-clickable').forEach(day => {
        day.addEventListener('click', function() {
            console.log("点击了不可用日期");
            // 轻微的视觉反馈
            this.style.opacity = '0.7';
            setTimeout(() => {
                this.style.opacity = '1';
            }, 200);
        });
    });
}

// 更新历史地图为5月3日数据
function updateHistoryMapToMay3() {
    if (!window.historyMap) return;
    
    // 清除已有标记
    if (window.historyMarkers) {
        window.historyMarkers.forEach(marker => {
            marker.setMap(null);
        });
    }
    
    window.historyMarkers = [];
    
    // 5月3日的事件数据
    const events = [
        { id: 201, position: [114.318572, 30.584355], type: "爆炸声音", level: "red", time: "11:20:15", description: "检测到疑似爆炸声音，已通知警方。" },
        { id: 202, position: [114.278572, 30.564355], type: "烟雾报警器", level: "orange", time: "13:45:30", description: "检测到烟雾报警器声音，持续约30秒。" },
        { id: 203, position: [114.338572, 30.554355], type: "枪声", level: "red", time: "02:10:05", description: "检测到疑似枪声，已通知警方。" },
        { id: 204, position: [114.288572, 30.544355], type: "哭泣", level: "yellow", time: "21:35:22", description: "检测到持续哭泣声，持续约2分钟。" },
        { id: 205, position: [114.318572, 30.564355], type: "人群噪音", level: "orange", time: "22:50:11", description: "检测到大量人群聚集噪音，持续约30分钟。" },
        { id: 206, position: [114.298572, 30.574355], type: "机械声", level: "blue", time: "08:15:40", description: "检测到建筑机械作业声音。" },
        { id: 207, position: [114.308572, 30.544355], type: "动力锯声", level: "blue", time: "09:30:25", description: "检测到动力锯切割声音，可能是园林作业。" },
        { id: 208, position: [114.328572, 30.584355], type: "普通人声", level: "blue", time: "12:20:35", description: "检测到正常人群交谈声，学校放学。" }
    ];
    
    // 添加事件标记到地图
    events.forEach(event => {
        const marker = new AMap.Marker({
            position: event.position,
            content: createHistoryEventDot(event.level),
            offset: new AMap.Pixel(-8, -8),
            zIndex: getHistoryLevelZIndex(event.level),
            extData: event
        });
        
        marker.on('click', function() {
            showEventModal(event);
        });
        
        marker.setMap(window.historyMap);
        window.historyMarkers.push(marker);
    });
    
    // 更新历史事件统计
    const summaryContainer = document.getElementById('history-summary');
    if (summaryContainer) {
        const eventCounts = {
            'red': 2,
            'orange': 2,
            'yellow': 1,
            'blue': 3,
            'green': 0
        };
        
        updateHistorySummary(summaryContainer, eventCounts);
    }
    
    // 更新历史安全指数
    const safetyContainer = document.getElementById('history-safety-index');
    if (safetyContainer) {
        const districtData = {
            '江岸区': { safetyLevel: 4 },
            '江汉区': { safetyLevel: 3 },
            '硚口区': { safetyLevel: 2 },
            '汉阳区': { safetyLevel: 3 },
            '武昌区': { safetyLevel: 5 },
            '青山区': { safetyLevel: 5 },
            '洪山区': { safetyLevel: 4 },
            '东西湖区': { safetyLevel: 2 },
            '蔡甸区': { safetyLevel: 1 },
            '江夏区': { safetyLevel: 3 },
            '黄陂区': { safetyLevel: 2 },
            '新洲区': { safetyLevel: 2 },
            '汉南区': { safetyLevel: 1 }
        };
        
        updateHistorySafety(safetyContainer, districtData);
    }
}

// 更新历史地图为5月4日数据
function updateHistoryMapToMay4() {
    if (!window.historyMap) return;
    
    // 清除已有标记
    if (window.historyMarkers) {
        window.historyMarkers.forEach(marker => {
            marker.setMap(null);
        });
    }
    
    window.historyMarkers = [];
    
    // 5月4日的事件数据
    const events = [
        { id: 101, position: [114.288572, 30.564355], type: "火警警报", level: "orange", time: "14:23:45", description: "检测到建筑火警报警器声音，持续时间约25秒。" },
        { id: 102, position: [114.308572, 30.594355], type: "汽车报警器", level: "yellow", time: "12:15:30", description: "检测到汽车防盗报警器声音，持续约40秒。" },
        { id: 103, position: [114.328572, 30.574355], type: "狗叫", level: "blue", time: "20:45:12", description: "检测到持续狗叫声，持续约3分钟。" },
        { id: 104, position: [114.268572, 30.564355], type: "引擎声", level: "blue", time: "23:30:45", description: "检测到大型车辆引擎声，持续约2分钟。" },
        { id: 105, position: [114.348572, 30.534355], type: "警笛声", level: "yellow", time: "18:10:24", description: "检测到警车警笛声，经过路口。" },
        { id: 106, position: [114.298572, 30.604355], type: "尖叫", level: "yellow", time: "22:40:33", description: "检测到人群尖叫声，可能是娱乐场所。" },
        { id: 107, position: [114.278572, 30.544355], type: "汽车喇叭", level: "blue", time: "17:25:18", description: "检测到密集汽车喇叭声，可能是交通拥堵。" }
    ];
    
    // 添加事件标记到地图
    events.forEach(event => {
        const marker = new AMap.Marker({
            position: event.position,
            content: createHistoryEventDot(event.level),
            offset: new AMap.Pixel(-8, -8),
            zIndex: getHistoryLevelZIndex(event.level),
            extData: event
        });
        
        marker.on('click', function() {
            showEventModal(event);
        });
        
        marker.setMap(window.historyMap);
        window.historyMarkers.push(marker);
    });
    
    // 更新历史事件统计
    const summaryContainer = document.getElementById('history-summary');
    if (summaryContainer) {
        const eventCounts = {
            'red': 0,
            'orange': 1,
            'yellow': 3,
            'blue': 3,
            'green': 0
        };
        
        updateHistorySummary(summaryContainer, eventCounts);
    }
    
    // 更新历史安全指数
    const safetyContainer = document.getElementById('history-safety-index');
    if (safetyContainer) {
        const districtData = {
            '江岸区': { safetyLevel: 3 },
            '江汉区': { safetyLevel: 2 },
            '硚口区': { safetyLevel: 2 },
            '汉阳区': { safetyLevel: 1 },
            '武昌区': { safetyLevel: 3 },
            '青山区': { safetyLevel: 4 },
            '洪山区': { safetyLevel: 5 },
            '东西湖区': { safetyLevel: 3 },
            '蔡甸区': { safetyLevel: 2 },
            '江夏区': { safetyLevel: 4 },
            '黄陂区': { safetyLevel: 2 },
            '新洲区': { safetyLevel: 3 },
            '汉南区': { safetyLevel: 1 }
        };
        
        updateHistorySafety(safetyContainer, districtData);
    }
}

// 更新历史事件统计
function updateHistorySummary(container, eventCounts) {
    // 生成HTML统计内容
    const typeNames = {
        'red': '极敏感事件',
        'orange': '敏感事件',
        'yellow': '关注事件',
        'blue': '普通事件',
        'green': '已处理事件'
    };
    
    const colorMap = {
        'red': '#ff3b30',
        'orange': '#ff9500',
        'yellow': '#ffcc00',
        'blue': '#007aff',
        'green': '#4cd964'
    };
    
    let html = '';
    Object.keys(typeNames).forEach(level => {
        const count = eventCounts[level] || 0;
        html += `
            <div class="event-type" style="display: flex; align-items: center; margin-bottom: 10px;">
                <div class="type-dot" style="width: 12px; height: 12px; border-radius: 50%; margin-right: 10px; background-color: ${colorMap[level]};"></div>
                <div class="type-name" style="flex: 1;">${typeNames[level]}</div>
                <div class="type-count" style="font-weight: bold; font-size: 16px;">${count}</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// 更新历史安全指数
function updateHistorySafety(container, districtData) {
    // 安全等级说明文字
    const safetyTexts = ['', '安全', '较安全', '一般', '需注意', '危险'];
    
    // 生成HTML，两列布局
    let html = '<div style="display: flex; flex-wrap: wrap;">';
    
    // 按区名排序区域列表
    const sortedDistricts = Object.keys(districtData).sort();
    
    sortedDistricts.forEach((district, index) => {
        const level = districtData[district].safetyLevel;
        
        const bgColors = ['', 
            'rgba(76, 217, 100, 0.2)', // 安全
            'rgba(76, 217, 100, 0.1)', // 较安全
            'rgba(255, 204, 0, 0.1)',  // 一般
            'rgba(255, 149, 0, 0.1)',  // 需注意
            'rgba(255, 59, 48, 0.1)'   // 危险
        ];
        
        html += `
            <div style="width: 50%; padding: 5px; box-sizing: border-box;">
                <div style="display: flex; justify-content: space-between; padding: 5px 10px; margin-bottom: 5px; border-radius: 4px; font-size: 14px; background-color: ${bgColors[level]}">
                    ${district}
                    <span>${safetyTexts[level]}</span>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    container.innerHTML = html;
}
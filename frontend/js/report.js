// 在顶部添加控制台输出
console.log("报告页面脚本已加载");

// 日报系统页面功能
document.addEventListener("DOMContentLoaded", function() {
    // 检查是否在日报页面
    if (!document.getElementById('report-page')) return;
    
    // 初始化区域安全指数
    initSafetyIndexReport();
    
    // 初始化本月事件柱状图
    initMonthlyEventChart();
    
    // 初始化年度事件折线图
    initYearlyTrendChart();
});

// 初始化区域安全指数
function initSafetyIndexReport() {
    console.log("开始初始化区域安全指数");
    const safetyContainer = document.querySelector('#area-safety-chart');
    if (!safetyContainer) {
        console.error("无法找到安全指数容器元素");
        return;
    }
    
    const districts = ['江岸区', '江汉区', '硚口区', '汉阳区', '武昌区', '青山区', '洪山区', '东西湖区', '蔡甸区', '江夏区', '黄陂区', '新洲区', '汉南区'];
    const safetyLevels = [72, 85, 64, 91, 68, 82, 55, 76, 88, 79, 83, 77, 90];
    
    // 创建两列显示
    let html = '<div style="display: flex; flex-wrap: wrap;">';
    
    districts.forEach((district, index) => {
        // 根据安全指数确定颜色
        let color = '#4cd964'; // 安全
        if (safetyLevels[index] < 60) color = '#ff3b30'; // 危险
        else if (safetyLevels[index] < 70) color = '#ff9500'; // 需注意 
        else if (safetyLevels[index] < 80) color = '#ffcc00'; // 一般
        
        // 计算宽度，基于安全值的百分比
        const width = safetyLevels[index]; 
        
        html += `
            <div style="width: 50%; padding: 5px; box-sizing: border-box;">
                <div style="margin-bottom: 10px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <div>${district}</div>
                        <div>${safetyLevels[index]}</div>
                    </div>
                    <div style="background-color: #eee; height: 10px; border-radius: 5px; overflow: hidden;">
                        <div style="width: ${width}%; height: 100%; background-color: ${color};"></div>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    safetyContainer.innerHTML = html;
    console.log("区域安全指数初始化完成");
}

// 初始化本月事件柱状图
function initMonthlyEventChart() {
    console.log("开始初始化本月事件统计");
    const chartContainer = document.getElementById('monthly-events-chart');
    if (!chartContainer) {
        console.error("无法找到月度事件图表容器");
        return;
    }
    
    // 模拟数据：本月各类型事件数量
    const eventTypes = [
        { type: '极敏感事件', count: 23, color: '#ff3b30' },
        { type: '敏感事件', count: 47, color: '#ff9500' },
        { type: '关注事件', count: 82, color: '#ffcc00' },
        { type: '普通事件', count: 156, color: '#007aff' }
    ];
    
    // 找出最大值，用于计算百分比高度
    const maxCount = Math.max(...eventTypes.map(d => d.count));
    
    // 生成柱状图HTML
    let html = '<div class="bar-chart" style="height: 250px; display: flex; align-items: flex-end; justify-content: space-around;">';
    
    eventTypes.forEach(event => {
        const height = (event.count / maxCount) * 220;
        
        html += `
            <div style="display: flex; flex-direction: column; align-items: center; width: 22%;">
                <div style="height: ${height}px; width: 100%; background-color: ${event.color}; margin-bottom: 10px; border-radius: 4px;"></div>
                <div style="font-size: 12px; white-space: nowrap;">${event.type}</div>
                <div style="font-weight: bold;">${event.count}</div>
            </div>
        `;
    });
    
    html += '</div>';
    
    // 更新DOM
    chartContainer.innerHTML = html;
    console.log("本月事件统计初始化完成");
}

// 修复年度事件折线图
function initYearlyTrendChart() {
    console.log("开始初始化年度事件趋势图");
    const chartContainer = document.getElementById('yearly-trend-chart');
    if (!chartContainer) {
        console.error("无法找到年度趋势图表容器");
        return;
    }
    
    const months = ['2024/6', '2024/7', '2024/8', '2024/9', '2024/10', '2024/11', '2024/12', '2025/1', '2025/2', '2025/3', '2025/4', '2025/5'];
    const totals = [145, 167, 189, 210, 178, 165, 195, 220, 195, 230, 255, 346];
    
    // 找出最大值用于计算比例
    const maxValue = Math.max(...totals);
    const height = 250;
    const width = chartContainer.offsetWidth || 600;
    
    // 计算点的坐标
    const points = [];
    for (let i = 0; i < months.length; i++) {
        const x = (i / (months.length - 1)) * width;
        const y = height - (totals[i] / maxValue * 0.8 * height);
        points.push({x, y});
    }
    
    // 创建绘图区域
    let html = `
        <div style="position: relative; height: ${height}px; margin-top: 20px; margin-bottom: 40px;">
            <!-- 创建背景网格 -->
            <div style="position: absolute; top: 0; left: 40px; right: 20px; bottom: 30px; border-left: 1px dashed #ccc; border-bottom: 1px dashed #ccc;">
                <div style="position: absolute; top: 25%; left: 0; right: 0; height: 1px; background: #eee;"></div>
                <div style="position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: #eee;"></div>
                <div style="position: absolute; top: 75%; left: 0; right: 0; height: 1px; background: #eee;"></div>
            </div>
            
            <!-- 使用<canvas>绘制折线 -->
            <canvas id="trend-line-canvas" width="${width}" height="${height}" style="position: absolute; top: 0; left: 0;"></canvas>
            
            <!-- X轴标签 -->
            <div style="position: absolute; bottom: 0; left: 40px; right: 20px; display: flex; justify-content: space-between;">
                ${months.map(month => `
                    <div style="transform: rotate(-45deg); transform-origin: top left; font-size: 12px;">${month}</div>
                `).join('')}
            </div>
            
            <!-- Y轴标签 -->
            <div style="position: absolute; top: 0; bottom: 30px; left: 0; display: flex; flex-direction: column; justify-content: space-between;">
                <div style="font-size: 12px;">${maxValue}</div>
                <div style="font-size: 12px;">${Math.round(maxValue/2)}</div>
                <div style="font-size: 12px;">0</div>
            </div>
        </div>
    `;
    
    chartContainer.innerHTML = html;
    
    // 使用Canvas绘制折线图
    setTimeout(() => {
        const canvas = document.getElementById('trend-line-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                // 清空画布
                ctx.clearRect(0, 0, width, height);
                
                // 绘制线条
                ctx.beginPath();
                ctx.moveTo(points[0].x + 40, points[0].y);
                for (let i = 1; i < points.length; i++) {
                    ctx.lineTo(points[i].x + 40, points[i].y);
                }
                ctx.strokeStyle = '#2196F3';
                ctx.lineWidth = 3;
                ctx.stroke();
                
                // 绘制点
                for (let i = 0; i < points.length; i++) {
                    ctx.beginPath();
                    ctx.arc(points[i].x + 40, points[i].y, 5, 0, Math.PI * 2);
                    ctx.fillStyle = i === points.length - 1 ? '#ff9500' : '#2196F3';
                    ctx.fill();
                }
                
                console.log("折线图绘制完成");
            } else {
                console.error("无法获取Canvas 2D上下文");
            }
        } else {
            console.error("无法找到Canvas元素");
        }
    }, 100);
    
    console.log("年度事件趋势初始化完成");
}

// 优化实时预警信息展示
function enhanceAlertDisplay() {
    const alertsContainer = document.querySelector('.report-card .alert-list');
    if (!alertsContainer) return;
    
    const alerts = [
        { time: '5月5日 21:34', content: '洪山区发生敏感事件：火警警报', level: 'orange' },
        { time: '5月4日 23:12', content: '江岸区发生关注事件：尖叫声', level: 'yellow' },
        { time: '5月2日 20:45', content: '武昌区发生极敏感事件：爆炸声', level: 'red' },
        { time: '5月1日 18:22', content: '青山区发生极敏感事件：枪声', level: 'red' },
        { time: '4月30日 15:45', content: '汉阳区发生敏感事件：烟雾报警器', level: 'orange' }
    ];
    
    let html = '';
    alerts.forEach(alert => {
        html += `
            <div class="alert-item" style="padding: 10px; border-left: 4px solid ${getLevelColor(alert.level)}; margin-bottom: 10px; background-color: rgba(0,0,0,0.03);">
                <div class="alert-time" style="font-weight: bold;">${alert.time}</div>
                <div class="alert-content">${alert.content}</div>
            </div>
        `;
    });
    
    alertsContainer.innerHTML = html;
}

// 优化本月重要事件展示
function enhanceImportantEvents() {
    const eventsContainer = document.querySelector('.important-events');
    if (!eventsContainer) return;
    
    const events = [
        { date: '5月5日', content: '洪山区检测到火警警报，安保人员已到场处理', level: 'orange' },
        { date: '5月4日', content: '江汉区检测到汽车报警器，系统自动记录', level: 'yellow' },
        { date: '5月3日', content: '武昌区检测到警笛声，已记录并通知相关部门', level: 'yellow' },
        { date: '5月2日', content: '武昌区检测到爆炸声，已通知警方处理', level: 'red' },
        { date: '5月1日', content: '青山区检测到枪声，警方已介入调查', level: 'red' },
        { date: '4月30日', content: '汉阳区检测到烟雾报警器，消防部门已确认虚警', level: 'orange' }
    ];
    
    let html = '';
    events.forEach(event => {
        html += `
            <div class="event-item" style="display: flex; padding: 10px; border-bottom: 1px solid #eee;">
                <div class="event-time" style="min-width: 60px; font-weight: bold;">${event.date}</div>
                <div class="event-content" style="flex: 1; position: relative; padding-left: 15px;">
                    <span style="position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 8px; height: 8px; border-radius: 50%; background-color: ${getLevelColor(event.level)};"></span>
                    ${event.content}
                </div>
            </div>
        `;
    });
    
    eventsContainer.innerHTML = html;
}

// 获取事件级别对应的颜色
function getLevelColor(level) {
    const colors = {
        'red': '#ff3b30',
        'orange': '#ff9500',
        'yellow': '#ffcc00',
        'blue': '#007aff',
        'green': '#4cd964'
    };
    return colors[level] || colors.blue;
}

// 修改页面加载事件处理
document.addEventListener('DOMContentLoaded', function() {
    console.log("页面已加载，准备初始化报告页面");
    
    // 立即尝试初始化一次
    setTimeout(function() {
        if (document.getElementById('report-page')) {
            console.log("找到报告页面，开始初始化");
            initSafetyIndexReport();
            initMonthlyEventChart();
            initYearlyTrendChart();
            enhanceAlertDisplay();
            enhanceImportantEvents();
        }
    }, 500);
});

// 向全局对象暴露函数，确保其他脚本可以访问
window.initSafetyIndexReport = initSafetyIndexReport;
window.initMonthlyEventChart = initMonthlyEventChart;
window.initYearlyTrendChart = initYearlyTrendChart;
window.enhanceAlertDisplay = enhanceAlertDisplay;
window.enhanceImportantEvents = enhanceImportantEvents; 
// 监控系统页面脚本
document.addEventListener("DOMContentLoaded", function() {
    console.log("监控系统脚本初始化");
    
    // 当页面切换到监控系统时初始化
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if(link.getAttribute('data-page') === 'monitoring') {
            link.addEventListener('click', initMonitoringSystem);
        }
    });
    
    // 如果当前页面就是监控系统页面，直接初始化
    if(document.getElementById('monitoring-page').classList.contains('active')) {
        initMonitoringSystem();
    }
});

// 初始化监控系统
function initMonitoringSystem() {
    console.log("初始化监控系统");
    
    // 获取视频元素和提示信息
    const videoElement = document.getElementById('monitoring-video');
    const noVideoMessage = document.getElementById('no-video-message');
    
    // 获取导入按钮
    const importButton = document.getElementById('import-video-btn');
    
    // 获取控制按钮
    const playPauseButton = document.getElementById('play-pause-btn');
    const fullscreenButton = document.getElementById('fullscreen-btn');
    
    // 为导入按钮添加点击事件
    if(importButton) {
        importButton.addEventListener('click', function() {
            // 预设的视频源
            const videoSrc = 'images/test2.mp4';
            
            // 设置视频源
            videoElement.querySelector('source').src = videoSrc;
            
            // 重新加载视频
            videoElement.load();
            
            // 隐藏提示信息，显示视频
            noVideoMessage.style.display = 'none';
            videoElement.style.display = 'block';
            
            // 播放视频
            videoElement.play()
                .then(() => {
                    console.log("视频播放成功");
                    // 更新按钮文本
                    playPauseButton.textContent = '⏸ 暂停';
                })
                .catch(error => {
                    console.error("视频播放失败:", error);
                    alert('视频播放失败，可能需要您点击播放按钮手动播放');
                });
        });
    } else {
        console.error("未找到导入按钮");
    }
    
    // 播放/暂停按钮点击事件
    if(playPauseButton) {
        playPauseButton.addEventListener('click', function() {
            if(videoElement.paused) {
                videoElement.play();
                this.textContent = '⏸ 暂停';
            } else {
                videoElement.pause();
                this.textContent = '▶ 播放';
            }
        });
    }
    
    // 全屏按钮点击事件
    if(fullscreenButton) {
        fullscreenButton.addEventListener('click', function() {
            if(videoElement.requestFullscreen) {
                videoElement.requestFullscreen();
            } else if(videoElement.webkitRequestFullscreen) {
                videoElement.webkitRequestFullscreen();
            } else if(videoElement.msRequestFullscreen) {
                videoElement.msRequestFullscreen();
            }
        });
    }
    
    // 视频播放结束事件
    videoElement.addEventListener('ended', function() {
        playPauseButton.textContent = '▶ 播放';
    });
    
    // 错误处理
    videoElement.addEventListener('error', function() {
        console.error('视频加载失败');
        alert('视频加载失败，请稍后重试');
    });
}

// 将函数暴露给全局
window.initMonitoringSystem = initMonitoringSystem; 
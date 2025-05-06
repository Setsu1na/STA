from flask import Flask, request, jsonify, abort
from werkzeug.utils import secure_filename
import os

# (假设这些模块存在于 backend 目录或已安装)
from . import audio_processor
from . import event_detector
from . import database
from .config import UPLOAD_FOLDER, ALLOWED_EXTENSIONS

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return "STA城哨 后端服务运行中"

@app.route('/api/v1/audio/upload', methods=['POST'])
def upload_audio():
    """接收上传的音频文件进行处理和事件检测"""
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        try:
            file.save(filepath)
            
            # 1. 处理音频 (例如，预处理、特征提取)
            features = audio_processor.extract_features(filepath)
            if not features:
                return jsonify({"error": "Feature extraction failed"}), 500

            # 2. 进行事件检测
            detection_result = event_detector.detect_event(features)
            if not detection_result:
                 return jsonify({"error": "Event detection failed"}), 500

            # 3. (可选) 保存事件到数据库
            event_data = {
                "filename": filename,
                "filepath": filepath,
                "timestamp": detection_result.get("timestamp"), # 假设检测结果包含时间戳
                "event_type": detection_result.get("event_type"),
                "confidence": detection_result.get("confidence"),
                "location": request.form.get("location", "Unknown") # 假设位置信息来自表单
            }
            event_id = database.save_detected_event(event_data)

            # 4. 清理上传的文件 (如果不再需要)
            # os.remove(filepath) 

            return jsonify({
                "message": "File processed successfully", 
                "event_detected": detection_result.get("event_type", "None"),
                "confidence": detection_result.get("confidence", 0.0),
                "event_id": event_id
                }), 200

        except Exception as e:
            # 在生产环境中应记录更详细的错误
            print(f"Error processing file {filename}: {e}")
            # 尝试清理可能未完全保存的文件
            if os.path.exists(filepath):
                 try:
                     os.remove(filepath)
                 except OSError:
                     pass # 忽略清理错误
            return jsonify({"error": "Internal server error during file processing"}), 500
        
    else:
        return jsonify({"error": "File type not allowed"}), 400

@app.route('/api/v1/events', methods=['GET'])
def get_events():
    """查询检测到的事件 (可添加过滤参数)"""
    # 示例：可以通过 request.args 获取查询参数，如 ?limit=10&type=alarm
    limit = request.args.get('limit', default=20, type=int)
    event_type_filter = request.args.get('type', default=None, type=str)
    
    try:
        events = database.get_events(limit=limit, event_type=event_type_filter)
        return jsonify(events), 200
    except Exception as e:
        print(f"Error fetching events: {e}")
        return jsonify({"error": "Failed to retrieve events"}), 500

@app.route('/api/v1/events/<int:event_id>', methods=['GET'])
def get_event_details(event_id):
    """获取特定事件的详细信息"""
    try:
        event = database.get_event_by_id(event_id)
        if event:
            return jsonify(event), 200
        else:
            abort(404, description="Event not found")
    except Exception as e:
        print(f"Error fetching event {event_id}: {e}")
        return jsonify({"error": "Failed to retrieve event details"}), 500

# 可以添加更多 API 端点，例如获取实时流状态、配置管理等

if __name__ == '__main__':
    # 生产环境应使用 Gunicorn 或 uWSGI 等 WSGI 服务器
    app.run(debug=True, host='0.0.0.0', port=5000) # debug=True 仅用于开发 
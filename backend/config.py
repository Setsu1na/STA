import os

# 基本应用配置
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
ALLOWED_EXTENSIONS = {'wav', 'mp3', 'ogg', 'flac'}

# 数据库配置 (示例，实际应从环境变量或配置文件读取)
# 使用 SQLite 示例
# DATABASE_URI = 'sqlite:///./sta_events.db' 
# 使用 PostgreSQL 示例
# DATABASE_URI = 'postgresql://user:password@host:port/database'
DATABASE_URI = 'sqlite:///:memory:' # 默认使用内存数据库进行模拟

# 模型配置 (示例)
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'event_detection_model.h5') 
# 特征提取配置 (如果需要放在配置中)
FEATURE_CONFIG = {
    'sample_rate': 16000,
    'n_fft': 2048,
    'hop_length': 512,
    'n_mels': 128
}

# 其他配置，例如日志级别、密钥等
SECRET_KEY = os.environ.get('SECRET_KEY', 'a_very_secret_key_for_dev_only')
LOG_LEVEL = 'DEBUG' # 开发时使用 DEBUG 
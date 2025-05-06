# from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
# from sqlalchemy.orm import sessionmaker, declarative_base
# from sqlalchemy.sql import func
# from .config import DATABASE_URI
import datetime
import random

# Base = declarative_base()

# # 示例数据模型 (如果使用 ORM)
# class DetectedEvent(Base):
#     __tablename__ = 'detected_events'
#     id = Column(Integer, primary_key=True)
#     filename = Column(String)
#     filepath = Column(String)
#     timestamp = Column(DateTime(timezone=True), server_default=func.now())
#     detection_timestamp = Column(Float) # 检测到的事件在音频中的时间戳 (如果模型提供)
#     event_type = Column(String, index=True)
#     confidence = Column(Float)
#     location = Column(String)
#     created_at = Column(DateTime(timezone=True), server_default=func.now())

# # 初始化数据库连接 (实际应用中应更健壮)
# engine = create_engine(DATABASE_URI)
# Base.metadata.create_all(engine)
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 模拟数据库存储
simulated_db = []
next_event_id = 1

def get_db_session():
    """模拟获取数据库会话"""
    # db = SessionLocal()
    # try:
    #     yield db
    # finally:
    #     db.close()
    # 模拟行为: 返回内存列表
    global simulated_db
    return simulated_db

def save_detected_event(event_data):
    """模拟保存检测到的事件到数据库"""
    global next_event_id
    db = get_db_session() 
    
    # 实际代码:
    # new_event = DetectedEvent(**event_data)
    # db.add(new_event)
    # db.commit()
    # db.refresh(new_event)
    # return new_event.id

    # 模拟行为:
    print(f"Simulating saving event to DB: {event_data.get('event_type')}")
    event_data['id'] = next_event_id
    event_data['created_at'] = datetime.datetime.now(datetime.timezone.utc)
    # 将时间戳转换为 ISO 格式字符串以便 JSON 序列化
    if 'timestamp' in event_data and isinstance(event_data['timestamp'], float):
         event_data['detection_timestamp_iso'] = datetime.datetime.fromtimestamp(event_data['timestamp'], datetime.timezone.utc).isoformat()
    
    db.append(event_data.copy()) # 保存副本
    current_id = next_event_id
    next_event_id += 1
    return current_id

def get_events(limit=20, event_type=None):
    """模拟从数据库查询事件列表"""
    db = get_db_session()
    
    # 实际代码:
    # query = db.query(DetectedEvent)
    # if event_type:
    #     query = query.filter(DetectedEvent.event_type == event_type)
    # events = query.order_by(DetectedEvent.created_at.desc()).limit(limit).all()
    # # 可能需要将 SQLAlchemy 对象转换为字典列表
    # return [event.__dict__ for event in events] 

    # 模拟行为:
    print(f"Simulating fetching events (limit={limit}, type={event_type})")
    filtered_events = db
    if event_type:
        filtered_events = [e for e in db if e.get('event_type') == event_type]
    
    # 按创建时间倒序排序 (模拟)
    sorted_events = sorted(filtered_events, key=lambda x: x.get('created_at'), reverse=True)
    return sorted_events[:limit]

def get_event_by_id(event_id):
    """模拟根据 ID 获取单个事件"""
    db = get_db_session()
    
    # 实际代码:
    # event = db.query(DetectedEvent).filter(DetectedEvent.id == event_id).first()
    # return event.__dict__ if event else None

    # 模拟行为:
    print(f"Simulating fetching event by ID: {event_id}")
    for event in db:
        if event.get('id') == event_id:
            return event
    return None 
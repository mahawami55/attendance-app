from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func
from .base import Base

class Institution(Base):
    """نموذج المؤسسة التعليمية"""
    __tablename__ = 'institutions'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(200), nullable=False)  # اسم الجامعة
    department = Column(String(200), nullable=False)  # اسم القسم
    location = Column(String(200))  # الموقع
    logo_url = Column(String(500))  # رابط الشعار
    description = Column(Text)  # وصف المؤسسة
    contact_email = Column(String(100))  # البريد الإلكتروني
    contact_phone = Column(String(20))  # رقم الهاتف
    website = Column(String(200))  # الموقع الإلكتروني
    is_active = Column(Integer, default=1)  # حالة النشاط
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    def to_dict(self):
        """تحويل البيانات إلى قاموس"""
        return {
            'id': self.id,
            'name': self.name,
            'department': self.department,
            'location': self.location,
            'logo_url': self.logo_url,
            'description': self.description,
            'contact_email': self.contact_email,
            'contact_phone': self.contact_phone,
            'website': self.website,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }




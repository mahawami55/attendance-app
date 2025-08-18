import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from src.models.attendance import db
from src.routes.auth import auth_bp
from src.routes.attendance import attendance_bp
from src.routes.user import user_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'

# Enable CORS for all routes
CORS(app, supports_credentials=True)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(attendance_bp, url_prefix='/api/attendance')
app.register_blueprint(user_bp, url_prefix='/api')

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Create database tables
with app.app_context():
    db.create_all()
    
    # Add sample data if database is empty
    from src.models.attendance import Student, Instructor, Course, Enrollment, AttendanceSession, AttendanceRecord
    from src.models.institution import Institution
    from datetime import date, time, datetime
    
    # Create institution data first
    if Institution.query.count() == 0:
        institution = Institution(
            name='جامعة بنغازي',
            department='قسم علوم الحاسوب - المرج',
            location='المرج، ليبيا',
            description='جامعة بنغازي هي إحدى الجامعات الرائدة في ليبيا، وقسم علوم الحاسوب بالمرج يقدم تعليماً متميزاً في مجال تقنية المعلومات.',
            contact_email='cs@uob.edu.ly',
            contact_phone='+218-61-1234567',
            website='www.uob.edu.ly'
        )
        db.session.add(institution)
        db.session.commit()
        print("Institution data created successfully!")
    
    if Student.query.count() == 0:
        # Create sample students
        student1 = Student(
            student_id='S001',
            name='أحمد طالب',
            email='student@test.com',
            phone='123456789',
            major='علوم الحاسوب',
            year=3
        )
        student1.set_password('password')
        
        student2 = Student(
            student_id='S002',
            name='فاطمة محمد',
            email='fatima@test.com',
            phone='987654321',
            major='هندسة البرمجيات',
            year=2
        )
        student2.set_password('password')
        
        # Create sample instructor
        instructor1 = Instructor(
            instructor_id='I001',
            name='د. أحمد يوسف',
            email='instructor@test.com',
            phone='555666777',
            department='علوم الحاسوب',
            title='دكتور'
        )
        instructor1.set_password('password')
        
        db.session.add_all([student1, student2, instructor1])
        db.session.commit()
        
        # Create sample courses
        course1 = Course(
            course_code='CS301',
            name='تحليل الخوارزميات',
            description='مقرر متقدم في تحليل وتصميم الخوارزميات',
            credits=3,
            semester='Fall 2023',
            year=2023,
            room='قاعة 210',
            schedule='الأحد والثلاثاء 9:45-11:00',
            instructor_id=instructor1.id
        )
        
        course2 = Course(
            course_code='CS201',
            name='بنية البيانات',
            description='أساسيات هياكل البيانات والخوارزميات',
            credits=3,
            semester='Fall 2023',
            year=2023,
            room='قاعة 106',
            schedule='الاثنين والأربعاء 12:15-13:30',
            instructor_id=instructor1.id
        )
        
        course3 = Course(
            course_code='MATH101',
            name='الرياضيات',
            description='الرياضيات الأساسية للحاسوب',
            credits=3,
            semester='Fall 2023',
            year=2023,
            room='قاعة 301',
            schedule='الثلاثاء والخميس 14:15-15:30',
            instructor_id=instructor1.id
        )
        
        db.session.add_all([course1, course2, course3])
        db.session.commit()
        
        # Create enrollments
        enrollment1 = Enrollment(student_id=student1.id, course_id=course1.id)
        enrollment2 = Enrollment(student_id=student1.id, course_id=course2.id)
        enrollment3 = Enrollment(student_id=student1.id, course_id=course3.id)
        enrollment4 = Enrollment(student_id=student2.id, course_id=course1.id)
        enrollment5 = Enrollment(student_id=student2.id, course_id=course2.id)
        
        db.session.add_all([enrollment1, enrollment2, enrollment3, enrollment4, enrollment5])
        db.session.commit()
        
        # Create sample attendance sessions
        today = date.today()
        session1 = AttendanceSession(
            course_id=course1.id,
            session_date=today,
            start_time=time(9, 45),
            end_time=time(11, 0),
            session_type='lecture',
            topic='مقدمة في تحليل الخوارزميات'
        )
        
        session2 = AttendanceSession(
            course_id=course2.id,
            session_date=today,
            start_time=time(12, 15),
            end_time=time(13, 30),
            session_type='lecture',
            topic='المصفوفات والقوائم المترابطة'
        )
        
        session3 = AttendanceSession(
            course_id=course3.id,
            session_date=today,
            start_time=time(14, 15),
            end_time=time(15, 30),
            session_type='lecture',
            topic='الجبر الخطي'
        )
        
        db.session.add_all([session1, session2, session3])
        db.session.commit()
        
        print("Sample data created successfully!")

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)



rom flask import Blueprint, request, jsonify, session
from src.models.attendance import db, Student, Instructor
from src.models.institution import Institution

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login endpoint for both students and instructors"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        user_type = data.get('user_type', 'student')  # student or instructor
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        user = None
        if user_type == 'student':
            user = Student.query.filter_by(email=email).first()
        elif user_type == 'instructor':
            user = Instructor.query.filter_by(email=email).first()
        else:
            return jsonify({'error': 'Invalid user type'}), 400
        
        if user and user.check_password(password):
            # Store user info in session
            session['user_id'] = user.id
            session['user_type'] = user_type
            session['user_email'] = user.email
            
            return jsonify({
                'message': 'Login successful',
                'user': user.to_dict(),
                'user_type': user_type
            }), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Logout endpoint"""
    try:
        session.clear()
        return jsonify({'message': 'Logout successful'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/register/student', methods=['POST'])
def register_student():
    """Register a new student"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['student_id', 'name', 'email', 'password']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check if student already exists
        if Student.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        if Student.query.filter_by(student_id=data['student_id']).first():
            return jsonify({'error': 'Student ID already registered'}), 400
        
        # Create new student
        student = Student(
            student_id=data['student_id'],
            name=data['name'],
            email=data['email'],
            phone=data.get('phone'),
            major=data.get('major'),
            year=data.get('year')
        )
        student.set_password(data['password'])
        
        db.session.add(student)
        db.session.commit()
        
        return jsonify({
            'message': 'Student registered successfully',
            'student': student.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/register/instructor', methods=['POST'])
def register_instructor():
    """Register a new instructor"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['instructor_id', 'name', 'email', 'password']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check if instructor already exists
        if Instructor.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        if Instructor.query.filter_by(instructor_id=data['instructor_id']).first():
            return jsonify({'error': 'Instructor ID already registered'}), 400
        
        # Create new instructor
        instructor = Instructor(
            instructor_id=data['instructor_id'],
            name=data['name'],
            email=data['email'],
            phone=data.get('phone'),
            department=data.get('department'),
            title=data.get('title')
        )
        instructor.set_password(data['password'])
        
        db.session.add(instructor)
        db.session.commit()
        
        return jsonify({
            'message': 'Instructor registered successfully',
            'instructor': instructor.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/profile', methods=['GET'])
def get_profile():
    """Get current user profile"""
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'Not authenticated'}), 401
        
        user_id = session['user_id']
        user_type = session['user_type']
        
        user = None
        if user_type == 'student':
            user = Student.query.get(user_id)
        elif user_type == 'instructor':
            user = Instructor.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'user': user.to_dict(),
            'user_type': user_type
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/check-session', methods=['GET'])
def check_session():
    """Check if user is authenticated"""
    try:
        if 'user_id' in session:
            return jsonify({
                'authenticated': True,
                'user_id': session['user_id'],
                'user_type': session['user_type'],
                'user_email': session['user_email']
            }), 200
        else:
            return jsonify({'authenticated': False}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/institution', methods=['GET'])
def get_institution():
    """Get institution information"""
    try:
        institution = Institution.query.filter_by(is_active=1).first()
        
        if not institution:
            # Return default institution data if none exists
            return jsonify({
                'institution': {
                    'name': 'جامعة بنغازي',
                    'department': 'قسم علوم الحاسوب - المرج',
                    'location': 'المرج، ليبيا',
                    'description': 'جامعة بنغازي - قسم علوم الحاسوب',
                    'contact_email': 'cs@uob.edu.ly',
                    'contact_phone': '+218-61-1234567',
                    'website': 'www.uob.edu.ly'
                }
            }), 200
        
        return jsonify({
            'institution': institution.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500




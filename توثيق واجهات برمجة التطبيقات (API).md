# توثيق واجهات برمجة التطبيقات (API)
## نظام الحضور الجامعي

### نظرة عامة
يوفر نظام الحضور الجامعي مجموعة شاملة من واجهات برمجة التطبيقات (APIs) لإدارة الحضور والغياب، المصادقة، وإدارة البيانات.

**Base URL**: `http://localhost:5000/api`

### المصادقة والأمان
- جميع الطلبات تتطلب جلسة صحيحة
- يتم استخدام Flask Sessions لإدارة الجلسات
- كلمات المرور مشفرة باستخدام Werkzeug
- دعم CORS للطلبات المتقاطعة

---

## 1. Authentication APIs

### 1.1 تسجيل الدخول
```http
POST /api/auth/login
```

**Body Parameters:**
```json
{
  "email": "string",
  "password": "string", 
  "user_type": "student|instructor"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "أحمد طالب",
    "email": "student@test.com",
    "student_id": "S001"
  },
  "user_type": "student"
}
```

**Response (401):**
```json
{
  "error": "Invalid credentials"
}
```

### 1.2 تسجيل الخروج
```http
POST /api/auth/logout
```

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

### 1.3 تسجيل طالب جديد
```http
POST /api/auth/register/student
```

**Body Parameters:**
```json
{
  "student_id": "string",
  "name": "string",
  "email": "string",
  "password": "string",
  "phone": "string (optional)",
  "major": "string (optional)",
  "year": "integer (optional)"
}
```

**Response (201):**
```json
{
  "message": "Student registered successfully",
  "student": {
    "id": 1,
    "student_id": "S001",
    "name": "أحمد طالب",
    "email": "student@test.com"
  }
}
```

### 1.4 تسجيل محاضر جديد
```http
POST /api/auth/register/instructor
```

**Body Parameters:**
```json
{
  "instructor_id": "string",
  "name": "string", 
  "email": "string",
  "password": "string",
  "phone": "string (optional)",
  "department": "string (optional)",
  "title": "string (optional)"
}
```

### 1.5 الحصول على بيانات المستخدم
```http
GET /api/auth/profile
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "name": "أحمد طالب",
    "email": "student@test.com"
  },
  "user_type": "student"
}
```

### 1.6 فحص الجلسة
```http
GET /api/auth/check-session
```

**Response (200):**
```json
{
  "authenticated": true,
  "user_id": 1,
  "user_type": "student",
  "user_email": "student@test.com"
}
```

---

## 2. Attendance APIs

### 2.1 الحصول على المقررات
```http
GET /api/attendance/courses
```

**Response (200):**
```json
{
  "courses": [
    {
      "id": 1,
      "course_code": "CS301",
      "name": "تحليل الخوارزميات",
      "credits": 3,
      "semester": "Fall 2023",
      "room": "قاعة 210",
      "schedule": "الأحد والثلاثاء 9:45-11:00",
      "instructor_name": "د. أحمد يوسف"
    }
  ]
}
```

### 2.2 الحصول على جلسات الحضور
```http
GET /api/attendance/sessions?course_id={course_id}
```

**Query Parameters:**
- `course_id` (optional): معرف المقرر

**Response (200):**
```json
{
  "sessions": [
    {
      "id": 1,
      "course_id": 1,
      "session_date": "2023-08-14",
      "start_time": "09:45:00",
      "end_time": "11:00:00",
      "session_type": "lecture",
      "topic": "مقدمة في تحليل الخوارزميات",
      "is_active": true,
      "bluetooth_enabled": true,
      "qr_enabled": true,
      "course_name": "تحليل الخوارزميات"
    }
  ]
}
```

### 2.3 إنشاء جلسة حضور جديدة (محاضر فقط)
```http
POST /api/attendance/sessions
```

**Body Parameters:**
```json
{
  "course_id": 1,
  "session_date": "2023-08-14",
  "start_time": "09:45",
  "end_time": "11:00",
  "session_type": "lecture",
  "topic": "مقدمة في تحليل الخوارزميات",
  "bluetooth_enabled": true,
  "qr_enabled": true
}
```

**Response (201):**
```json
{
  "message": "Session created successfully",
  "session": {
    "id": 1,
    "course_id": 1,
    "session_date": "2023-08-14",
    "start_time": "09:45:00",
    "end_time": "11:00:00"
  }
}
```

### 2.4 تسجيل الحضور (طالب فقط)
```http
POST /api/attendance/mark-attendance
```

**Body Parameters:**
```json
{
  "session_id": 1,
  "attendance_method": "bluetooth|qr_code|manual",
  "notes": "string (optional)"
}
```

**Response (201):**
```json
{
  "message": "Attendance marked successfully",
  "record": {
    "id": 1,
    "student_id": 1,
    "session_id": 1,
    "attendance_method": "bluetooth",
    "status": "present",
    "check_in_time": "2023-08-14T09:50:00"
  }
}
```

**Response (400):**
```json
{
  "error": "Attendance already marked for this session"
}
```

### 2.5 الحصول على سجلات الحضور
```http
GET /api/attendance/attendance-records?course_id={course_id}&session_id={session_id}
```

**Query Parameters:**
- `course_id` (optional): معرف المقرر
- `session_id` (optional): معرف الجلسة

**Response (200):**
```json
{
  "records": [
    {
      "id": 1,
      "student_id": 1,
      "session_id": 1,
      "attendance_method": "bluetooth",
      "check_in_time": "2023-08-14T09:50:00",
      "status": "present",
      "student_name": "أحمد طالب",
      "course_name": "تحليل الخوارزميات"
    }
  ]
}
```

### 2.6 الحصول على إحصائيات الحضور
```http
GET /api/attendance/attendance-stats?course_id={course_id}
```

**Response (200) - للطلاب:**
```json
{
  "stats": [
    {
      "course_id": 1,
      "course_name": "تحليل الخوارزميات",
      "total_sessions": 10,
      "attended_sessions": 8,
      "attendance_rate": 80.0
    }
  ]
}
```

**Response (200) - للمحاضرين:**
```json
{
  "stats": [
    {
      "course_id": 1,
      "course_name": "تحليل الخوارزميات",
      "total_sessions": 10,
      "enrolled_students": 25,
      "total_attendance": 200,
      "expected_attendance": 250,
      "attendance_rate": 80.0
    }
  ]
}
```

### 2.7 بيانات لوحة التحكم
```http
GET /api/attendance/dashboard
```

**Response (200) - للطلاب:**
```json
{
  "user_type": "student",
  "today_sessions": [
    {
      "id": 1,
      "course_name": "تحليل الخوارزميات",
      "start_time": "09:45:00",
      "end_time": "11:00:00",
      "room": "قاعة 210",
      "attendance_status": "present",
      "attendance_method": "bluetooth"
    }
  ]
}
```

**Response (200) - للمحاضرين:**
```json
{
  "user_type": "instructor",
  "today_sessions": [
    {
      "id": 1,
      "course_name": "تحليل الخوارزميات",
      "start_time": "09:45:00",
      "end_time": "11:00:00",
      "room": "قاعة 210",
      "attendance_count": 18,
      "enrolled_count": 25
    }
  ]
}
```

---

## 3. نماذج البيانات (Data Models)

### 3.1 Student Model
```json
{
  "id": "integer",
  "student_id": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "major": "string", 
  "year": "integer",
  "created_at": "datetime"
}
```

### 3.2 Instructor Model
```json
{
  "id": "integer",
  "instructor_id": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "department": "string",
  "title": "string",
  "created_at": "datetime"
}
```

### 3.3 Course Model
```json
{
  "id": "integer",
  "course_code": "string",
  "name": "string",
  "description": "string",
  "credits": "integer",
  "semester": "string",
  "year": "integer",
  "room": "string",
  "schedule": "string",
  "instructor_id": "integer",
  "instructor_name": "string",
  "created_at": "datetime"
}
```

### 3.4 AttendanceSession Model
```json
{
  "id": "integer",
  "course_id": "integer",
  "session_date": "date",
  "start_time": "time",
  "end_time": "time",
  "session_type": "string",
  "topic": "string",
  "is_active": "boolean",
  "bluetooth_enabled": "boolean",
  "qr_enabled": "boolean",
  "course_name": "string",
  "created_at": "datetime"
}
```

### 3.5 AttendanceRecord Model
```json
{
  "id": "integer",
  "student_id": "integer",
  "session_id": "integer",
  "attendance_method": "string",
  "check_in_time": "datetime",
  "status": "string",
  "notes": "string",
  "student_name": "string",
  "course_name": "string",
  "created_at": "datetime"
}
```

---

## 4. رموز الحالة والأخطاء

### 4.1 رموز الحالة الناجحة
- `200 OK`: الطلب نجح
- `201 Created`: تم إنشاء المورد بنجاح

### 4.2 رموز الأخطاء
- `400 Bad Request`: بيانات الطلب غير صحيحة
- `401 Unauthorized`: غير مصرح بالوصول
- `403 Forbidden`: ممنوع الوصول
- `404 Not Found`: المورد غير موجود
- `500 Internal Server Error`: خطأ في الخادم

### 4.3 أمثلة على رسائل الأخطاء
```json
{
  "error": "Email and password are required"
}
```

```json
{
  "error": "Authentication required"
}
```

```json
{
  "error": "Insufficient permissions"
}
```

---

## 5. أمثلة على الاستخدام

### 5.1 تسجيل دخول طالب
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  body: JSON.stringify({
    email: 'student@test.com',
    password: 'password',
    user_type: 'student'
  })
});

const data = await response.json();
console.log(data);
```

### 5.2 تسجيل الحضور
```javascript
const response = await fetch('/api/attendance/mark-attendance', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  body: JSON.stringify({
    session_id: 1,
    attendance_method: 'bluetooth',
    notes: 'حضرت في الوقت المحدد'
  })
});

const data = await response.json();
console.log(data);
```

### 5.3 الحصول على التقارير
```javascript
const response = await fetch('/api/attendance/attendance-stats?course_id=1', {
  method: 'GET',
  credentials: 'include'
});

const data = await response.json();
console.log(data.stats);
```

---

## 6. معالجة الأخطاء

### 6.1 مثال على معالجة الأخطاء
```javascript
try {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(loginData)
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }
  
  // معالجة النجاح
  console.log('Login successful:', data);
  
} catch (error) {
  // معالجة الخطأ
  console.error('Login failed:', error.message);
}
```

---

## 7. اختبار الـ APIs

### 7.1 استخدام cURL
```bash
# تسجيل الدخول
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@test.com","password":"password","user_type":"student"}' \
  -c cookies.txt

# الحصول على المقررات
curl -X GET http://localhost:5000/api/attendance/courses \
  -b cookies.txt
```

### 7.2 استخدام Postman
1. إنشاء مجموعة جديدة للـ APIs
2. إضافة طلبات للـ endpoints المختلفة
3. تفعيل إدارة الـ cookies للجلسات
4. اختبار جميع الـ endpoints

---

## 8. الأمان والأفضل الممارسات

### 8.1 الأمان
- استخدم HTTPS في بيئة الإنتاج
- لا تشارك معلومات الجلسة
- تحقق من صحة جميع البيانات المدخلة
- استخدم كلمات مرور قوية

### 8.2 أفضل الممارسات
- استخدم معالجة الأخطاء المناسبة
- تحقق من حالة الاستجابة قبل معالجة البيانات
- استخدم timeout للطلبات
- قم بتسجيل الأخطاء للمراجعة

---

## 9. الدعم والتطوير

### 9.1 متطلبات التطوير
- Python 3.11+
- Flask 3.1+
- SQLAlchemy
- Flask-CORS

### 9.2 إعداد بيئة التطوير
```bash
# إنشاء البيئة الافتراضية
python -m venv venv

# تفعيل البيئة الافتراضية
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# تثبيت المتطلبات
pip install -r requirements.txt

# تشغيل الخادم
python src/main.py
```

### 9.3 التواصل
- **GitHub**: [repository-link]
- **البريد الإلكتروني**: developer@attendance-system.com
- **التوثيق**: [documentation-link]

---

**تاريخ آخر تحديث**: 14 أغسطس 2025
**إصدار API**: v1.0.0


### 1.7 الحصول على معلومات المؤسسة
```http
GET /api/auth/institution
```

**الوصف**: الحصول على معلومات الجامعة والقسم

**Response (200):**
```json
{
  "institution": {
    "id": 1,
    "name": "جامعة بنغازي",
    "department": "قسم علوم الحاسوب - المرج",
    "location": "المرج، ليبيا",
    "description": "جامعة بنغازي هي إحدى الجامعات الرائدة في ليبيا، وقسم علوم الحاسوب بالمرج يقدم تعليماً متميزاً في مجال تقنية المعلومات.",
    "contact_email": "cs@uob.edu.ly",
    "contact_phone": "+218-61-1234567",
    "website": "www.uob.edu.ly",
    "is_active": 1,
    "created_at": "2025-08-14T11:53:00.000Z",
    "updated_at": "2025-08-14T11:53:00.000Z"
  }
}
```

**Response (200) - Default if no institution exists:**
```json
{
  "institution": {
    "name": "جامعة بنغازي",
    "department": "قسم علوم الحاسوب - المرج",
    "location": "المرج، ليبيا",
    "description": "جامعة بنغازي - قسم علوم الحاسوب",
    "contact_email": "cs@uob.edu.ly",
    "contact_phone": "+218-61-1234567",
    "website": "www.uob.edu.ly"
  }
}
```

---

## تحديث نماذج البيانات

### 3.6 Institution Model
```json
{
  "id": "integer",
  "name": "string",
  "department": "string",
  "location": "string",
  "logo_url": "string",
  "description": "string",
  "contact_email": "string",
  "contact_phone": "string",
  "website": "string",
  "is_active": "integer",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

---

## مثال على الاستخدام الجديد

### الحصول على معلومات المؤسسة
```javascript
const response = await fetch('/api/auth/institution', {
  method: 'GET',
  credentials: 'include'
});

const data = await response.json();
console.log('Institution:', data.institution);

// استخدام المعلومات في الواجهة
document.getElementById('university-name').textContent = data.institution.name;
document.getElementById('department-name').textContent = data.institution.department;
```

---

## التحديثات الجديدة في الإصدار v1.1.0

### الميزات المضافة
- ✅ **API جديد**: `/api/auth/institution` للحصول على معلومات المؤسسة
- ✅ **نموذج جديد**: Institution Model في قاعدة البيانات
- ✅ **تخصيص كامل**: النظام مخصص لجامعة بنغازي وقسم علوم الحاسوب
- ✅ **واجهات محدثة**: جميع الشاشات تعرض معلومات الجامعة والقسم

### البيانات الافتراضية
النظام يحتوي على البيانات التالية افتراضياً:
- **الجامعة**: جامعة بنغازي
- **القسم**: قسم علوم الحاسوب - المرج
- **الموقع**: المرج، ليبيا
- **البريد الإلكتروني**: cs@uob.edu.ly
- **الهاتف**: +218-61-1234567
- **الموقع الإلكتروني**: www.uob.edu.ly

---

**تاريخ آخر تحديث**: 14 أغسطس 2025
**إصدار API**: v1.1.0 (تحديث تخصيص الجامعة)


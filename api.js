// api.js
// ملف واحد لإدارة كل استدعاءات الـ API

const API_BASE_URL = "https://attendance-app.onrender.com"; 
// ⚠️ عدّل الرابط لاحقًا ليطابق عنوان خدمتك على Render

// تسجيل الدخول
export async function login(username, password) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return response.json();
}

// تسجيل الحضور باستخدام QR
export async function markAttendanceQR(userId, qrCode) {
  const response = await fetch(`${API_BASE_URL}/attendance/qr`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, qrCode }),
  });
  return response.json();
}

// تسجيل الحضور باستخدام Bluetooth
export async function markAttendanceBluetooth(userId, deviceId) {
  const response = await fetch(`${API_BASE_URL}/attendance/bluetooth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, deviceId }),
  });
  return response.json();
}

// جلب كل سجلات الحضور
export async function getAttendance() {
  const response = await fetch(`${API_BASE_URL}/attendance`);
  return response.json();
}

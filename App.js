import React, { useState, useEffect } from "react";
import {
  login,
  markAttendanceQR,
  markAttendanceBluetooth,
  getAttendance,
} from "./api";

function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [qrCode, setQrCode] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  // تسجيل الدخول
  async function handleLogin(e) {
    e.preventDefault();
    const result = await login(username, password);
    if (result.success) {
      setUser(result.user);
      alert("✅ تسجيل دخول ناجح");
    } else {
      alert("❌ فشل تسجيل الدخول");
    }
  }

  // تسجيل الحضور عبر QR
  async function handleQRSubmit(e) {
    e.preventDefault();
    if (!user) {
      alert("سجّل الدخول أولاً");
      return;
    }
    const result = await markAttendanceQR(user.id, qrCode);
    alert(result.message || JSON.stringify(result));
  }

  // تسجيل الحضور عبر Bluetooth
  async function handleBluetoothSubmit(e) {
    e.preventDefault();
    if (!user) {
      alert("سجّل الدخول أولاً");
      return;
    }
    const result = await markAttendanceBluetooth(user.id, deviceId);
    alert(result.message || JSON.stringify(result));
  }

  // تحميل السجلات
  async function loadAttendance() {
    const records = await getAttendance();
    setAttendanceRecords(records);
  }

  useEffect(() => {
    loadAttendance();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
          📋 نظام الحضور والغياب
        </h1>

        {!user ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">
              تسجيل الدخول
            </h2>
            <input
              type="text"
              placeholder="اسم المستخدم"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="كلمة المرور"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
            >
              دخول
            </button>
          </form>
        ) : (
          <>
            <h2 className="text-lg font-medium text-gray-700 mb-4">
              👋 مرحباً {user.name}
            </h2>

            {/* تسجيل عبر QR */}
            <form onSubmit={handleQRSubmit} className="space-y-3 mb-6">
              <h3 className="text-gray-600 font-semibold">تسجيل الحضور عبر QR</h3>
              <input
                type="text"
                placeholder="أدخل كود QR"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition"
              >
                ✅ تسجيل
              </button>
            </form>

            {/* تسجيل عبر Bluetooth */}
            <form onSubmit={handleBluetoothSubmit} className="space-y-3 mb-6">
              <h3 className="text-gray-600 font-semibold">تسجيل الحضور عبر Bluetooth</h3>
              <input
                type="text"
                placeholder="أدخل معرف الجهاز"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition"
              >
                📶 تسجيل
              </button>
            </form>
          </>
        )}

        {/* عرض السجلات */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            📊 سجلات الحضور
          </h2>
          <button
            onClick={loadAttendance}
            className="mb-3 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
          >
            🔄 تحديث
          </button>
          <ul className="divide-y divide-gray-200">
            {attendanceRecords.length === 0 ? (
              <li className="text-gray-500 text-sm">لا توجد سجلات حالياً</li>
            ) : (
              attendanceRecords.map((rec, index) => (
                <li key={index} className="p-2">
                  <span className="font-semibold">{rec.user}</span> -{" "}
                  <span>{rec.method}</span> -{" "}
                  <span className="text-gray-500 text-sm">{rec.timestamp}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;

{"status":500,"name":"Error","message":"Input buffer contains unsupported image format"}
import React, { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import StudentDashboard from './components/StudentDashboard';
import InstructorDashboard from './components/InstructorDashboard';
import BluetoothAttendance from './components/BluetoothAttendance';
import QRAttendance from './components/QRAttendance';
import AttendanceReport from './components/AttendanceReport';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [user, setUser] = useState(null);

  const handleLogin = (userType, userData) => {
    setUser({ ...userData, type: userType });
    setCurrentScreen(userType === 'student' ? 'student-dashboard' : 'instructor-dashboard');
  };

  const handleNavigate = (screen, data = null) => {
    setCurrentScreen(screen);
    // Handle additional data if needed
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen('login');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen onLogin={handleLogin} />;
      case 'student-dashboard':
        return <StudentDashboard user={user} onNavigate={handleNavigate} />;
      case 'instructor-dashboard':
        return <InstructorDashboard user={user} onNavigate={handleNavigate} />;
      case 'bluetooth-attendance':
        return <BluetoothAttendance onNavigate={handleNavigate} />;
      case 'qr-attendance':
        return <QRAttendance onNavigate={handleNavigate} />;
      case 'attendance-report':
        return <AttendanceReport onNavigate={handleNavigate} />;
      case 'dashboard':
        // Redirect to appropriate dashboard based on user type
        return user?.type === 'student' 
          ? <StudentDashboard user={user} onNavigate={handleNavigate} />
          : <InstructorDashboard user={user} onNavigate={handleNavigate} />;
      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };

  return (
    <div className="font-arabic">
      {renderScreen()}
    </div>
  );
}

export default App;




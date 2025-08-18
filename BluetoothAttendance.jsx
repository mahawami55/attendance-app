import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bluetooth, CheckCircle, Users, Wifi } from 'lucide-react';

const BluetoothAttendance = ({ onNavigate }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [detectedStudents, setDetectedStudents] = useState([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [attendanceMarked, setAttendanceMarked] = useState(false);

  const mockStudents = [
    { id: 1, name: 'أحمد علي', distance: '5م', status: 'detected' },
    { id: 2, name: 'خالد محمد', distance: '8م', status: 'detected' },
    { id: 3, name: 'فاطمة يوسف', distance: '3م', status: 'confirmed' },
    { id: 4, name: 'سارة أحمد', distance: '12م', status: 'detected' },
    { id: 5, name: 'محمد حسن', distance: '7م', status: 'confirmed' }
  ];

  const currentCourse = {
    name: 'تحليل الخوارزميات',
    time: '10:02 - 11:00',
    room: 'قاعة 210'
  };

  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            // Simulate detecting students gradually
            const studentsToAdd = mockStudents.slice(0, Math.floor(Math.random() * 3) + 1);
            setDetectedStudents(prev => {
              const newStudents = studentsToAdd.filter(s => !prev.find(p => p.id === s.id));
              return [...prev, ...newStudents];
            });
            return 0;
          }
          return prev + 10;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isScanning]);

  const startScanning = () => {
    setIsScanning(true);
    setDetectedStudents([]);
    setAttendanceMarked(false);
  };

  const stopScanning = () => {
    setIsScanning(false);
    setScanProgress(0);
  };

  const markAttendance = () => {
    setAttendanceMarked(true);
    setIsScanning(false);
    setTimeout(() => {
      onNavigate('student-dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-500 text-white p-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => onNavigate('student-dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">تسجيل الحضور بالبلوتوث</h1>
          <div></div>
        </div>
      </div>

      {/* Course Info */}
      <div className="p-4 bg-white border-b">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-800">{currentCourse.name}</h2>
          <p className="text-sm text-gray-600">{currentCourse.time}</p>
          <p className="text-sm text-gray-600">{currentCourse.room}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {/* Bluetooth Scanner */}
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <div className={`w-32 h-32 rounded-full bg-blue-500 flex items-center justify-center ${
              isScanning ? 'animate-pulse' : ''
            }`}>
              <Bluetooth className="w-16 h-16 text-white" />
            </div>
            
            {isScanning && (
              <>
                <div className="absolute inset-0 rounded-full border-4 border-blue-300 animate-ping"></div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-400 animate-ping animation-delay-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-500 animate-ping animation-delay-400"></div>
              </>
            )}
          </div>
          
          <div className="mt-4">
            {!isScanning && !attendanceMarked && (
              <p className="text-gray-600 mb-4">اضغط للبدء في البحث عن المحاضر</p>
            )}
            {isScanning && (
              <p className="text-blue-600 mb-4">جاري البحث عن المحاضر...</p>
            )}
            {attendanceMarked && (
              <p className="text-green-600 mb-4">تم تسجيل الحضور بنجاح!</p>
            )}
          </div>

          {/* Progress Bar */}
          {isScanning && (
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-200"
                style={{ width: `${scanProgress}%` }}
              ></div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            {!isScanning && !attendanceMarked && (
              <Button 
                onClick={startScanning}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                بدء البحث
              </Button>
            )}
            
            {isScanning && (
              <Button 
                onClick={stopScanning}
                variant="outline"
                className="w-full"
              >
                إيقاف البحث
              </Button>
            )}

            {detectedStudents.length > 0 && !attendanceMarked && (
              <Button 
                onClick={markAttendance}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                تسجيل الحضور
              </Button>
            )}
          </div>
        </div>

        {/* Detected Students */}
        {detectedStudents.length > 0 && (
          <Card className="mt-6">
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Users className="w-5 h-5" />
                الطلاب المكتشفون ({detectedStudents.length})
              </h3>
              <div className="space-y-2">
                {detectedStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        student.status === 'confirmed' ? 'bg-green-500' : 'bg-blue-500'
                      }`}></div>
                      <span className="font-medium">{student.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Wifi className="w-4 h-4" />
                      {student.distance}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success Message */}
        {attendanceMarked && (
          <Card className="mt-6 border-green-200 bg-green-50">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold text-green-800 mb-1">تم تسجيل الحضور!</h3>
              <p className="text-sm text-green-600">سيتم توجيهك للصفحة الرئيسية...</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BluetoothAttendance;




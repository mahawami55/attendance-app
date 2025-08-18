{"status":500,"name":"Error","message":"Input buffer contains unsupported image format"}
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Camera, CheckCircle, Flashlight, QrCode } from 'lucide-react';

const QRAttendance = ({ onNavigate }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const currentCourse = {
    name: 'تحليل الخوارزميات',
    time: '10:00 صباحاً',
    instructor: 'د. أحمد محمد'
  };

  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            // Simulate successful scan
            setScanSuccess(true);
            setIsScanning(false);
            setTimeout(() => {
              onNavigate('student-dashboard');
            }, 2500);
            return 100;
          }
          return prev + 5;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isScanning]);

  const startScanning = () => {
    setIsScanning(true);
    setScanSuccess(false);
    setScanProgress(0);
  };

  const toggleFlash = () => {
    setFlashOn(!flashOn);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-blue-500 text-white p-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => onNavigate('student-dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">مسح رمز QR</h1>
          <button 
            onClick={toggleFlash}
            className={`p-2 rounded-full ${flashOn ? 'bg-yellow-400 text-gray-900' : 'bg-gray-600'}`}
          >
            <Flashlight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Course Info */}
      <div className="p-4 bg-white">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-800">{currentCourse.name}</h2>
          <p className="text-sm text-gray-600">{currentCourse.instructor}</p>
          <p className="text-sm text-gray-600">{currentCourse.time}</p>
        </div>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative bg-gray-800">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Camera Preview Simulation */}
          <div className="w-full h-96 bg-gradient-to-b from-gray-700 to-gray-900 relative overflow-hidden">
            {/* Scanning Frame */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* QR Code Frame */}
                <div className={`w-64 h-64 border-2 ${isScanning ? 'border-blue-400' : 'border-white'} rounded-lg relative`}>
                  {/* Corner indicators */}
                  <div className="absolute top-0 left-0 w-6 h-6 border-l-4 border-t-4 border-white rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-r-4 border-t-4 border-white rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-l-4 border-b-4 border-white rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-r-4 border-b-4 border-white rounded-br-lg"></div>
                  
                  {/* Sample QR Code */}
                  <div className="absolute inset-4 bg-white rounded flex items-center justify-center">
                    <div className="grid grid-cols-8 gap-1 w-full h-full p-2">
                      {Array.from({ length: 64 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`${Math.random() > 0.5 ? 'bg-black' : 'bg-white'} rounded-sm`}
                        ></div>
                      ))}
                    </div>
                  </div>

                  {/* Scanning Line */}
                  {isScanning && (
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute w-full h-1 bg-blue-400 animate-bounce" 
                           style={{ top: `${scanProgress}%` }}></div>
                    </div>
                  )}
                </div>

                {/* Success Indicator */}
                {scanSuccess && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-green-500 rounded-full p-4 animate-pulse">
                      <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-32 left-0 right-0 text-center text-white px-4">
          {!isScanning && !scanSuccess && (
            <p className="text-lg mb-4">وجه الكاميرا نحو رمز QR</p>
          )}
          {isScanning && (
            <p className="text-lg mb-4">جاري المسح...</p>
          )}
          {scanSuccess && (
            <div className="space-y-2">
              <p className="text-lg text-green-400">تم المسح بنجاح!</p>
              <p className="text-sm">جاري تسجيل الحضور...</p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="absolute bottom-8 left-0 right-0 px-4">
          {!isScanning && !scanSuccess && (
            <Button 
              onClick={startScanning}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3"
            >
              <QrCode className="w-5 h-5 mr-2" />
              بدء المسح
            </Button>
          )}
          
          {scanSuccess && (
            <Card className="bg-green-500 border-green-400">
              <CardContent className="p-4 text-center text-white">
                <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">تم تسجيل الحضور!</h3>
                <p className="text-sm opacity-90">سيتم توجيهك للصفحة الرئيسية...</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Progress Bar */}
        {isScanning && (
          <div className="absolute bottom-20 left-4 right-4">
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div 
                className="bg-blue-400 h-2 rounded-full transition-all duration-100"
                style={{ width: `${scanProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRAttendance;





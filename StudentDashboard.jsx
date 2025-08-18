{"status":500,"name":"Error","message":"Input buffer contains unsupported image format"}
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Settings, Calendar, MapPin, Clock, CheckCircle, XCircle, Plus, GraduationCap } from 'lucide-react';
import { useState, useEffect } from 'react';

const StudentDashboard = ({ user, onNavigate }) => {
  const [institution, setInstitution] = useState(null);

  // Load institution information
  useEffect(() => {
    const loadInstitution = async () => {
      try {
        const response = await fetch('/api/auth/institution', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setInstitution(data.institution);
        }
      } catch (error) {
        console.error('Failed to load institution info:', error);
        setInstitution({
          name: 'جامعة بنغازي',
          department: 'قسم علوم الحاسوب - المرج'
        });
      }
    };

    loadInstitution();
  }, []);
  const todaySchedule = [
    {
      id: 1,
      name: 'تحليل الخوارزميات',
      time: '8:30 - 9:45',
      room: 'قاعة 210',
      status: 'حاضر',
      color: 'green'
    },
    {
      id: 2,
      name: 'بنية البيانات',
      time: '11:00 - 12:15',
      room: 'قاعة 106',
      status: 'غائب',
      color: 'red'
    },
    {
      id: 3,
      name: 'الرياضيات',
      time: '1:00 - 2:15',
      room: 'قاعة 301',
      status: 'حاضر',
      color: 'green'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-500 text-white p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            <Settings className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <h2 className="font-semibold">{user?.name || 'أحمد طالب'}</h2>
            </div>
            <div className="w-10 h-10 bg-blue-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold">أ</span>
            </div>
          </div>
        </div>
        {institution && (
          <div className="text-center border-t border-blue-400 pt-2">
            <div className="flex items-center justify-center gap-2 mb-1">
              <GraduationCap className="w-4 h-4" />
              <h3 className="text-sm font-medium">{institution.name}</h3>
            </div>
            <p className="text-xs text-blue-100">{institution.department}</p>
          </div>
        )}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-4">جدول اليوم</h3>
        
        <div className="space-y-3">
          {todaySchedule.map((course) => (
            <Card key={course.id} className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      course.color === 'green' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{course.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {course.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {course.room}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-left">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      course.color === 'green' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {course.status}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">إجراءات سريعة</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={() => onNavigate('bluetooth-attendance')}
              className="h-16 bg-blue-500 hover:bg-blue-600 text-white"
            >
              <div className="text-center">
                <div className="text-sm font-semibold">تسجيل حضور</div>
                <div className="text-xs opacity-90">بالبلوتوث</div>
              </div>
            </Button>
            <Button 
              onClick={() => onNavigate('qr-attendance')}
              variant="outline"
              className="h-16"
            >
              <div className="text-center">
                <div className="text-sm font-semibold">مسح QR</div>
                <div className="text-xs text-gray-600">رمز الاستجابة</div>
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex justify-around">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="flex flex-col items-center gap-1 text-blue-500"
          >
            <Calendar className="w-5 h-5" />
            <span className="text-xs">الرئيسية</span>
          </button>
          <button 
            onClick={() => onNavigate('attendance-report')}
            className="flex flex-col items-center gap-1 text-gray-400"
          >
            <CheckCircle className="w-5 h-5" />
            <span className="text-xs">التقارير</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400">
            <Settings className="w-5 h-5" />
            <span className="text-xs">الإعدادات</span>
          </button>
        </div>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => onNavigate('bluetooth-attendance')}
        className="fixed bottom-20 left-4 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};

export default StudentDashboard;





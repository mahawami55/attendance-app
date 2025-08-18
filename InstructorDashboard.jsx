{"status":500,"name":"Error","message":"Input buffer contains unsupported image format"}
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Clock, MapPin, Plus, BarChart3, Calendar, Settings, GraduationCap } from 'lucide-react';
import { useState, useEffect } from 'react';

const InstructorDashboard = ({ user, onNavigate }) => {
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
  const todayLectures = [
    {
      id: 1,
      name: 'البرمجة',
      time: '8:30 - 9:30',
      room: '219 وار',
      students: 23,
      registered: 25
    },
    {
      id: 2,
      name: 'قواعد البيانات',
      time: '10:00 - 11:00',
      room: '217 وار',
      students: 30,
      registered: 32
    },
    {
      id: 3,
      name: 'الشبكات الحاسوبية',
      time: '1:00 - 2:00',
      room: '314 زهار',
      students: 30,
      registered: 35
    }
  ];

  const stats = {
    totalPresent: 18,
    totalAbsent: 7
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-500 text-white p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-right">
            <h2 className="text-xl font-bold">لوحة المحاضر</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <h3 className="font-semibold">{user?.name || 'د. أحمد يوسف'}</h3>
            </div>
            <div className="w-10 h-10 bg-blue-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold">د</span>
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

      {/* Main Content */}
      <div className="p-4 pb-24">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">محاضرات اليوم</h3>
        
        <div className="space-y-4">
          {todayLectures.map((lecture) => (
            <Card key={lecture.id} className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-800 text-lg">{lecture.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {lecture.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {lecture.room}
                      </div>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-gray-600">
                      <span className="text-blue-600 font-semibold">{lecture.students}</span> طالباً مسجل
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={() => onNavigate('start-session', lecture)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                  بدء جلسة الحضور
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Statistics */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-center">نظرة عامة على الإحصائيات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.totalPresent}</div>
                <div className="text-sm text-gray-600">حاضر</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{stats.totalAbsent}</div>
                <div className="text-sm text-gray-600">غائب</div>
              </div>
            </div>
          </CardContent>
        </Card>
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
            onClick={() => onNavigate('reports')}
            className="flex flex-col items-center gap-1 text-gray-400"
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs">التقارير</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400">
            <Users className="w-5 h-5" />
            <span className="text-xs">الطلاب</span>
          </button>
        </div>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => onNavigate('create-session')}
        className="fixed bottom-20 left-4 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};

export default InstructorDashboard;





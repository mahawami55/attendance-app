{"status":500,"name":"Error","message":"Input buffer contains unsupported image format"}
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, BarChart3, Download, Filter } from 'lucide-react';

const AttendanceReport = ({ onNavigate }) => {
  const [selectedMonth, setSelectedMonth] = useState('مايو 2023');
  
  const attendanceData = [
    {
      id: 1,
      courseName: 'برمجة الحاسوب',
      totalLectures: 8,
      attendedLectures: 7,
      percentage: 87,
      status: 'good'
    },
    {
      id: 2,
      courseName: 'الرياضيات',
      totalLectures: 5,
      attendedLectures: 4,
      percentage: 80,
      status: 'warning'
    },
    {
      id: 3,
      courseName: 'التاريخ',
      totalLectures: 10,
      attendedLectures: 6,
      percentage: 60,
      status: 'danger'
    }
  ];

  const monthlyCalendar = [
    [null, null, 1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10, 11, 12],
    [13, 14, 15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24, 25, 26],
    [27, 28, 29, 30, 31, null, null]
  ];

  const attendanceDays = [7, 14, 15, 21, 22, 28]; // Days with attendance

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'danger': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'good': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'danger': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
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
          <h1 className="text-lg font-semibold">تقرير الحضور والغياب</h1>
          <Button variant="ghost" size="sm" className="text-white">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Calendar View */}
      <Card className="m-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">التقويم الشهري</CardTitle>
            <div className="flex items-center gap-2">
              <button className="p-1">
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
              <span className="font-semibold">{selectedMonth}</span>
              <button className="p-1">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['ش', 'ج', 'خ', 'أ', 'ث', 'إ', 'س'].map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-gray-600 p-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Grid */}
          <div className="space-y-1">
            {monthlyCalendar.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-1">
                {week.map((day, dayIndex) => (
                  <div 
                    key={dayIndex} 
                    className={`h-8 flex items-center justify-center text-sm rounded ${
                      day === null 
                        ? '' 
                        : attendanceDays.includes(day)
                          ? 'bg-blue-500 text-white font-semibold'
                          : day === 14
                            ? 'bg-blue-100 text-blue-600 font-semibold border-2 border-blue-500'
                            : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>حضور</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-blue-500 bg-blue-100 rounded"></div>
              <span>اليوم الحالي</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Options */}
      <div className="px-4 mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            تصفية
          </Button>
          <Button variant="outline" size="sm">
            هذا الشهر
          </Button>
          <Button variant="outline" size="sm">
            آخر 3 أشهر
          </Button>
        </div>
      </div>

      {/* Course Statistics */}
      <div className="px-4 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">إحصائيات المقررات</h3>
        
        {attendanceData.map((course) => (
          <Card key={course.id} className={`${getStatusBg(course.status)}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-800">{course.courseName}</h4>
                  <p className="text-sm text-gray-600">
                    {course.totalLectures} محاضرات الكلية
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">
                    {course.percentage}%
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>الحضور</span>
                  <span>{course.attendedLectures}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>الغياب</span>
                  <span>{course.totalLectures - course.attendedLectures}</span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getStatusColor(course.status)}`}
                    style={{ width: `${course.percentage}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Statistics */}
      <Card className="m-4 mt-6">
        <CardHeader>
          <CardTitle className="text-center">الملخص العام</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">17</div>
              <div className="text-sm text-gray-600">إجمالي الحضور</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">6</div>
              <div className="text-sm text-gray-600">إجمالي الغياب</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">74%</div>
              <div className="text-sm text-gray-600">المعدل العام</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="h-20"></div> {/* Bottom padding for navigation */}
    </div>
  );
};

export default AttendanceReport;





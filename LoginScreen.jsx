{"status":500,"name":"Error","message":"Input buffer contains unsupported image format"}
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Mail, Lock, GraduationCap, AlertCircle, Loader2, MapPin } from 'lucide-react';
import { apiHelpers } from '../services/api';

const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('student'); // 'student' or 'instructor'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [institution, setInstitution] = useState(null);

  // Load institution information on component mount
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
        // Set default values if API fails
        setInstitution({
          name: 'جامعة بنغازي',
          department: 'قسم علوم الحاسوب - المرج',
          location: 'المرج، ليبيا'
        });
      }
    };

    loadInstitution();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await apiHelpers.loginUser(email, password, userType);
      
      if (result.success) {
        onLogin(result.userType, result.user);
      } else {
        setError(result.error || 'فشل في تسجيل الدخول');
      }
    } catch (error) {
      setError('حدث خطأ في الاتصال بالخادم');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (demoUserType) => {
    setIsLoading(true);
    setError('');

    const demoCredentials = {
      student: { email: 'student@test.com', password: 'password' },
      instructor: { email: 'instructor@test.com', password: 'password' }
    };

    const credentials = demoCredentials[demoUserType];
    setEmail(credentials.email);
    setPassword(credentials.password);
    setUserType(demoUserType);
    
    try {
      const result = await apiHelpers.loginUser(credentials.email, credentials.password, demoUserType);
      
      if (result.success) {
        onLogin(result.userType, result.user);
      } else {
        setError(result.error || 'فشل في تسجيل الدخول التجريبي');
      }
    } catch (error) {
      setError('حدث خطأ في الاتصال بالخادم');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    if (error) setError(''); // Clear error when user starts typing
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              نظام الحضور الجامعي
            </h1>
            {institution && (
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-blue-600">
                  {institution.name}
                </h2>
                <p className="text-sm text-gray-600">
                  {institution.department}
                </p>
                {institution.location && (
                  <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                    <MapPin className="w-3 h-3" />
                    <span>{institution.location}</span>
                  </div>
                )}
              </div>
            )}
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  value={email}
                  onChange={handleInputChange(setEmail)}
                  className="pr-10 h-12 text-right"
                  disabled={isLoading}
                  required
                />
              </div>
              
              <div className="relative">
                <Lock className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="كلمة المرور"
                  value={password}
                  onChange={handleInputChange(setPassword)}
                  className="pr-10 h-12 text-right"
                  disabled={isLoading}
                  required
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={userType === 'student' ? 'default' : 'outline'}
                  onClick={() => setUserType('student')}
                  className="flex-1 h-12"
                  disabled={isLoading}
                >
                  طالب
                </Button>
                <Button
                  type="button"
                  variant={userType === 'instructor' ? 'default' : 'outline'}
                  onClick={() => setUserType('instructor')}
                  className="flex-1 h-12"
                  disabled={isLoading}
                >
                  محاضر
                </Button>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  'تسجيل الدخول'
                )}
              </Button>
            </form>

            <div className="space-y-3 pt-4 border-t">
              <p className="text-sm text-gray-600 text-center">تسجيل دخول تجريبي:</p>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleDemoLogin('student')}
                  variant="outline"
                  className="flex-1 h-10"
                  disabled={isLoading}
                >
                  طالب تجريبي
                </Button>
                <Button
                  onClick={() => handleDemoLogin('instructor')}
                  variant="outline"
                  className="flex-1 h-10"
                  disabled={isLoading}
                >
                  محاضر تجريبي
                </Button>
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <button className="text-sm text-blue-500 hover:underline">
                نسيت كلمة المرور؟
              </button>
              <div className="text-sm text-gray-600">
                ليس لديك حساب؟{' '}
                <button className="text-blue-500 hover:underline">
                  إنشاء حساب جديد
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginScreen;





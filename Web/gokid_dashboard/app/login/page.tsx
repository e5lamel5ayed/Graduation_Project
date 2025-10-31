'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/auth-context';
import { EyeIcon, EyeSlashIcon, UserIcon, LockClosedIcon, PresentationChartLineIcon, ChartBarIcon,ArrowTrendingUpIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/solid';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const success = await login(email, password);
      if (success) {
        router.push('/home');
      } else {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      }
    } catch (err) {
      setError('حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf8fb] via-white to-[#f5f0f7] flex items-center justify-center p-4">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-6xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex relative z-10 border border-white/50">
        {/* Left Side - Welcome Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#f0e8f4] via-[#f5f0f7] to-[#faf8fb] relative overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-32 h-32 border-2 border-purple-300 rounded-full animate-pulse"></div>
            <div className="absolute bottom-32 right-20 w-24 h-24 border-2 border-purple-300 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 left-1/3 w-16 h-16 border-2 border-purple-300 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
            <div className="absolute top-1/3 right-1/4 w-20 h-20 border border-purple-200 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
          </div>
          
          {/* Gradient Orbs */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
          
          <div className="flex flex-col justify-center items-center text-[#7b6c83] p-12 relative z-10 w-full">
            {/* Logo with Enhanced Shadow */}
            <div className="w-24 h-24 rounded-2xl flex items-center justify-center mb-8 shadow-2xl transform transition-transform duration-300 hover:scale-105 hover:rotate-3">
              <img src="/photo_2025-10-31_21-33-23.jpg" alt="GoKid Logo" className="w-full h-full object-contain rounded-2xl" />
            </div>
            
            {/* System Name with Gradient */}
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#5c5163] to-[#8b7a94] bg-clip-text text-transparent mb-12 text-center">
              نظام إدارة الحضانة الذكي
            </h2>
            
            {/* Features with Hover Effects */}
            <div className="space-y-6 w-full max-w-sm">
              <div className="flex items-center space-x-4 space-x-reverse bg-white/40 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/50 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-white/50 group">
                <div className="w-12 h-12 bg-gradient-to-br from-[#faf8fb] to-white rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                  <ArrowTrendingUpIcon className="w-6 h-6 text-[#5c5163] group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex-1 text-right">
                  <h3 className="font-semibold text-[#5c5163]">تتبع الطفل</h3>
                  <p className="text-sm text-[#b9a2c5]">مراقبة تقدم أطفالك في كل لحظة</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 space-x-reverse bg-white/40 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/50 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-white/50 group" style={{transitionDelay: '50ms'}}>
                <div className="w-12 h-12 bg-gradient-to-br from-[#faf8fb] to-white rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                  <ChartBarIcon className="w-6 h-6 text-[#5c5163] group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex-1 text-right">
                  <h3 className="font-semibold text-[#5c5163]">لوحة التحليلات</h3>
                  <p className="text-sm text-[#b9a2c5]">أدوات تقارير شاملة</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 space-x-reverse bg-white/40 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/50 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-white/50 group" style={{transitionDelay: '100ms'}}>
                <div className="w-12 h-12 bg-gradient-to-br from-[#faf8fb] to-white rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                  <ClipboardDocumentListIcon className="w-6 h-6 text-[#5c5163] group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex-1 text-right">
                  <h3 className="font-semibold text-[#5c5163]">إدارة المهام</h3>
                  <p className="text-sm text-[#b9a2c5]">تتبع المهام والأوقات</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
          {/* Mobile Background with Enhanced Gradient */}
          <div className="lg:hidden absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-white opacity-60"></div>
        
          <div className="w-full max-w-md relative z-10">
            {/* Header with Animation */}
            <div className="text-center mb-8 animate-fade-in">
             
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[#5c5163] to-[#8b7a94] bg-clip-text text-transparent mb-2">
                مرحباً بعودتك
              </h2>
              <p className="text-[#7b6c83]">قم بتسجيل الدخول للوصول إلى حسابك</p>
            </div>

            {/* Main Card with Enhanced Design */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-purple-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Message with Better Design */}
                {error && (
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 border-r-4 border-red-500 text-red-700 p-4 rounded-xl flex items-start gap-3 animate-shake shadow-md">
                    <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium flex-1 text-right">{error}</span>
                  </div>
                )}

                {/* Email Field with Enhanced Style */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-[#5c5163] text-right mb-2">
                    البريد الإلكتروني
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none z-10">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#f0e8f4] to-[#faf8fb] rounded-lg flex items-center justify-center group-focus-within:shadow-md transition-shadow">
                        <UserIcon className="h-5 w-5 text-[#7b6c83] group-focus-within:text-[#5c5163] transition-colors duration-200" />
                      </div>
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      className="block w-full pr-14 pl-4 py-4 bg-gradient-to-r from-gray-50 to-purple-50/30 border-2 border-gray-200 rounded-2xl text-[#5c5163] placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-[#5c5163] transition-all duration-200 text-right hover:border-[#7b6c83] hover:shadow-md"
                      placeholder="أدخل بريدك الإلكتروني"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      dir="rtl"
                    />
                  </div>
                </div>

                {/* Password Field with Enhanced Style */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-[#5c5163] text-right mb-2">
                    كلمة المرور
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none z-10">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#f0e8f4] to-[#faf8fb] rounded-lg flex items-center justify-center group-focus-within:shadow-md transition-shadow">
                        <LockClosedIcon className="h-5 w-5 text-[#7b6c83] group-focus-within:text-[#5c5163] transition-colors duration-200" />
                      </div>
                    </div>  
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      className="block w-full pr-14 pl-14 py-4 bg-gradient-to-r from-gray-50 to-purple-50/30 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-[#5c5163] transition-all duration-200 text-right hover:border-[#7b6c83] hover:shadow-md"
                      placeholder="أدخل كلمة المرور"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      dir="rtl"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 left-0 pl-4 flex items-center z-10 hover:scale-110 transition-transform duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-purple-50 rounded-lg flex items-center justify-center hover:shadow-md transition-shadow">
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-[#5c5163] transition-colors" />
                        ) : ( 
                          <EyeIcon className="h-5 w-5 text-gray-400 hover:text-[#5c5163] transition-colors" />
                        )}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot with Better Styling */}
                <div className="flex items-center justify-between text-sm">
                  <button type="button" className="text-[#5c5163] hover:text-[#8b7a94] font-medium hover:underline transition-all duration-200 hover:translate-x-1">
                    نسيت كلمة المرور؟
                  </button>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <span className="text-[#5c5163] group-hover:text-[#8b7a94] transition-colors duration-200">تذكرني</span>
                    <input type="checkbox" className="w-4 h-4 text-[#5c5163] border-gray-300 rounded focus:ring-[#7b6c83] focus:ring-2 cursor-pointer accent-[#5c5163]" />
                  </label>
                </div>

                {/* Submit Button with Gradient and Animation */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full relative group overflow-hidden bg-gradient-to-r from-[#5c5163] via-[#7b6c83] to-[#8b7a94] hover:from-[#7b6c83] hover:via-[#8b7a94] hover:to-[#5c5163] text-white py-4 px-6 rounded-2xl font-semibold  disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                  <span className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>جاري التحميل...</span>
                      </>
                    ) : (
                      <>
                        <span>تسجيل الدخول</span>
                        
                      </>
                    )}
                  </span>
                </button>
              </form>
            </div>

            {/* Footer with Better Design */}
            <div className="text-center mt-8">
              <div className="bg-gradient-to-r from-transparent via-purple-200 to-transparent h-px mb-6"></div>
              <p className="text-sm text-gray-600">
                ليس لديك حساب؟{' '}
                <button className="text-[#5c5163] font-bold hover:text-[#8b7a94] hover:underline transition-all duration-200 hover:translate-x-1 inline-block">
                  سجّل الآن
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
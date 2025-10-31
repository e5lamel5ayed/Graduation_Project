'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/src/lib/utils';
import {  
  LockClosedIcon, 
  ArrowTrendingUpIcon, 
  ChartBarIcon, 
  ClipboardDocumentListIcon,
  ArrowLeftOnRectangleIcon,
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/lib/contexts/auth-context';
import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle, FeatureCard, Input } from '@/src/components';

// Password Input Component
const PasswordInput = (props: React.ComponentProps<typeof Input>) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      {...props}
      type={showPassword ? 'text' : 'password'}
      rightIcon={
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-gray-400 hover:text-gray-500"
        >
          {showPassword ? (
            <EyeSlashIcon className="w-5 h-5" />
          ) : (
            <EyeIcon className="w-5 h-5" />
          )}
        </button>
      }
    />
  );
};

const features = [
  {
    icon: <ArrowTrendingUpIcon className="w-6 h-6" />,
    title: 'Child Tracking',
    description: 'Monitor your children\'s progress in real-time',
  },
  {
    icon: <ChartBarIcon className="w-6 h-6" />,
    title: 'Analytics Dashboard',
    description: 'Accurate statistics and reports',
  },
  {
    icon: <ClipboardDocumentListIcon className="w-6 h-6" />,
    title: 'Task Management',
    description: 'Track tasks and schedules',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth() as { login: (email: string, password: string) => Promise<boolean> };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const success = await login(email, password);
      if (success) {
        router.push('/home');
      } else {
        setError('Incorrect email or password');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    }
  };


  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf8fb] via-white to-[#f5f0f7] flex items-center justify-center p-4">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-6xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden flex relative z-10 border border-white/50">
        {/* Left Side - Welcome Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#cdb4db] via-[#f8f4fa] to-[#faf8fb] relative overflow-hidden">
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
              <img 
                src="/photo_2025-10-31_21-33-23.jpg" 
                alt="GoKid Logo" 
                className="w-full h-full object-contain rounded-2xl" 
              />
            </div>
            
            {/* System Name with Gradient */}
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#5c5163] to-[#8b7a94] bg-clip-text text-transparent mb-12 text-center">
              Smart Nursery Management System
            </h2>
            
            {/* Features with Hover Effects */}
            <div className="space-y-6 w-full max-w-sm">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  style={{ transitionDelay: `${index * 50}ms` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
          {/* Mobile Background with Enhanced Gradient */}
          <div className="lg:hidden absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-white opacity-60"></div>
        
          <div className="w-full max-w-md relative z-10">
            <Card shadow='none' className="bg-white/90 backdrop-blur-md border-0 ">
              <CardHeader className="text-center space-y-1">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#5c5163] to-[#8b7a94] bg-clip-text text-transparent">
                  Welcome Back
                </CardTitle>
                <p className="text-[#7b6c83]">Sign in to access your account</p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Error Message */}
                  {error && (
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 border-r-4 border-red-500 text-red-700 p-4 rounded-xl flex items-start gap-3 animate-shake">
                      <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium flex-1 text-right">{error}</span>
                    </div>
                  )}

                  {/* Email Field */}
                  <Input
                    label="Email"
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={handleEmailChange}
                    leftIcon={<EnvelopeIcon className="w-5 h-5 text-gray-400" />}
                    dir="rtl"
                    required
                  />

                  {/* Password Field */}
                  <PasswordInput
                    label="Password"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                    leftIcon={<LockClosedIcon className="w-5 h-5 text-gray-400" />}
                    dir="rtl"
                    required
                  />

                  {/* Remember & Forgot */}
                  <div className="flex items-center justify-between text-sm">
                    <button 
                      type="button" 
                      className="text-[#5c5163] hover:text-[#8b7a94] font-medium hover:underline transition-all duration-200 hover:translate-x-1"
                    >
                      Forgot password?
                    </button>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <span className="text-[#5c5163] group-hover:text-[#8b7a94] transition-colors duration-200">
                        Remember me
                      </span>
                      <input type="checkbox" className="w-4 h-4 text-[#5c5163] border-gray-300 rounded focus:ring-[#7b6c83] focus:ring-2 cursor-pointer accent-[#5c5163]" />
                    </label>
                  </div>

                  {/* Submit Button with Gradient and Animation */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    size='default'
                    className="w-full relative group overflow-hidden bg-gradient-to-r from-[#5c5163] via-[#7b6c83] to-[#8b7a94] hover:from-[#7b6c83] hover:via-[#8b7a94] hover:to-[#5c5163] text-white py-4 px-6 font-semibold disabled:opacity-50  transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                    <span className="relative flex items-center justify-center gap-2">
                      {isLoading ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Loading...</span>
                        </>
                      ) : (
                        <span>Sign In</span>
                      )}
                    </span>
                  </Button>
                </form>
              </CardContent>
              
              {/* Footer with Better Design */}
              <CardFooter className="justify-center pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button 
                    type="button"
                    className="text-[#5c5163] font-bold hover:text-[#8b7a94] hover:underline transition-all duration-200 hover:translate-x-1"
                  >
                    Sign up now
                  </button>
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/src/lib/utils';
import {
  LockClosedIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  XMarkIcon,
  CheckCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/solid';
import { useAuth } from '@/lib/contexts/auth-context';
import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle, FeatureCard, Input } from '@/src/components';
import { authService } from '@/src/services/authService';

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

// ─── Forgot Password Modal ───────────────────────────────────────────────────
type ForgotStep = 'email' | 'otp' | 'newPassword' | 'success';

function ForgotPasswordModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<ForgotStep>('email');
  const [fpEmail, setFpEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [userId, setUserId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fpError, setFpError] = useState('');
  const [fpLoading, setFpLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Auto-focus first OTP input when step changes
  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    }
  }, [step]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    pasted.split('').forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);
    const nextEmpty = newOtp.findIndex(v => !v);
    otpRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();
  };

  const sendOtp = async () => {
    setFpError('');
    setFpLoading(true);
    try {
      const response = await authService.forgotPassword(fpEmail);
      const retrievedUserId = response?.data?.userId;
      if (!retrievedUserId) {
        throw new Error("Unable to retrieve user information. Please try again.");
      }
      setUserId(retrievedUserId);
      setStep('otp');
      setResendCooldown(60);
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message ||
        (err?.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(', ') : '') ||
        err?.message ||
        'Failed to send OTP. Please check your email.';
      setFpError(errorMsg);
    } finally {
      setFpLoading(false);
    }
  };

  const verifyOtpAndProceed = () => {
    const otpString = otp.join('');
    if (otpString.length < 6) {
      setFpError('Please enter the full 6-digit code.');
      return;
    }
    setFpError('');
    setStep('newPassword');
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 8) { setFpError('Password must be at least 8 characters.'); return; }
    if (newPassword !== confirmPassword) { setFpError('Passwords do not match.'); return; }
    setFpError('');
    setFpLoading(true);
    try {
      await authService.resetPassword(userId, otp.join(''), newPassword, confirmPassword);
      setStep('success');
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message ||
        (err?.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(', ') : '') ||
        'Failed to reset password. Please try again.';
      setFpError(errorMsg);
    } finally {
      setFpLoading(false);
    }
  };

  const stepInfo = {
    email: { num: 1, title: 'Forgot Password', sub: 'Enter your email to receive a reset code' },
    otp: { num: 2, title: 'Enter Reset Code', sub: `We sent a 6-digit code to ${fpEmail}` },
    newPassword: { num: 3, title: 'Create New Password', sub: 'Choose a strong new password' },
    success: { num: 4, title: 'Password Reset!', sub: '' },
  };
  const info = stepInfo[step];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-[#5c5163] via-[#7b6c83] to-[#8b7a94] p-8 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>

          {step !== 'success' && (
            <div className="flex items-center gap-2 mb-4">
              {['email', 'otp', 'newPassword'].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300',
                    ['email', 'otp', 'newPassword'].indexOf(step) > i
                      ? 'bg-white text-[#5c5163]'
                      : step === s
                        ? 'bg-white/30 border-2 border-white text-white'
                        : 'bg-white/10 text-white/50'
                  )}>{i + 1}</div>
                  {i < 2 && (
                    <div className={cn(
                      'h-0.5 w-8 rounded transition-all duration-500',
                      ['email', 'otp', 'newPassword'].indexOf(step) > i ? 'bg-white' : 'bg-white/20'
                    )} />
                  )}
                </div>
              ))}
            </div>
          )}

          {step === 'success' ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 animate-bounce">
                <CheckCircleIcon className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold">{info.title}</h2>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold">{info.title}</h2>
              <p className="text-white/80 text-sm mt-1">{info.sub}</p>
            </>
          )}
        </div>

        {/* Body */}
        <div className="p-8 space-y-5">
          {/* Error */}
          {fpError && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-xl text-sm flex items-center gap-2">
              <XMarkIcon className="w-4 h-4 flex-shrink-0" />
              {fpError}
            </div>
          )}

          {/* Step 1: Email */}
          {step === 'email' && (
            <div className="space-y-4">
              <Input
                label="Email Address"
                id="fp-email"
                type="email"
                placeholder="Enter your registered email"
                value={fpEmail}
                onChange={(e) => setFpEmail(e.target.value)}
                leftIcon={<EnvelopeIcon className="w-5 h-5 text-gray-400" />}
                required
                autoFocus
              />
              <Button
                onClick={sendOtp}
                disabled={fpLoading || !fpEmail}
                className="w-full bg-gradient-to-r from-[#5c5163] to-[#8b7a94] hover:from-[#7b6c83] hover:to-[#5c5163] text-white py-3 font-semibold transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
              >
                {fpLoading ? (
                  <span className="flex items-center gap-2">
                    <ArrowPathIcon className="w-4 h-4 animate-spin" /> Sending...
                  </span>
                ) : 'Send Reset Code'}
              </Button>
            </div>
          )}

          {/* Step 2: OTP */}
          {step === 'otp' && (
            <div className="space-y-5">
              <div>
                <p className="text-sm font-medium text-[#5c5163] mb-3 text-center">Enter 6-digit code</p>
                <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className={cn(
                        'w-11 h-13 text-center text-xl font-bold border-2 rounded-xl outline-none transition-all duration-200',
                        digit
                          ? 'border-[#7b6c83] bg-purple-50 text-[#5c5163]'
                          : 'border-gray-200 bg-gray-50 text-gray-800',
                        'focus:border-[#5c5163] focus:bg-white focus:shadow-md'
                      )}
                      style={{ width: '2.75rem', height: '3.25rem' }}
                    />
                  ))}
                </div>
              </div>
              <Button
                onClick={verifyOtpAndProceed}
                disabled={fpLoading || otp.join('').length < 6}
                className="w-full bg-gradient-to-r from-[#5c5163] to-[#8b7a94] hover:from-[#7b6c83] hover:to-[#5c5163] text-white py-3 font-semibold transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
              >
                {fpLoading ? (
                  <span className="flex items-center gap-2">
                    <ArrowPathIcon className="w-4 h-4 animate-spin" /> Verifying...
                  </span>
                ) : 'Verify Code'}
              </Button>
              <div className="text-center">
                <button
                  type="button"
                  disabled={resendCooldown > 0 || fpLoading}
                  onClick={sendOtp}
                  className="text-sm text-[#5c5163] hover:underline disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
                >
                  {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Code'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: New Password */}
          {step === 'newPassword' && (
            <div className="space-y-4">
              <div className="relative">
                <Input
                  label="New Password"
                  id="fp-new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  leftIcon={<LockClosedIcon className="w-5 h-5 text-gray-400" />}
                  rightIcon={
                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="text-gray-400 hover:text-gray-600">
                      {showNewPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                  }
                />
              </div>
              <div className="relative">
                <Input
                  label="Confirm Password"
                  id="fp-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  leftIcon={<LockClosedIcon className="w-5 h-5 text-gray-400" />}
                  rightIcon={
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-gray-400 hover:text-gray-600">
                      {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                  }
                />
              </div>
              {/* Password strength indicator */}
              {newPassword.length > 0 && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={cn(
                        'h-1 flex-1 rounded-full transition-all duration-300',
                        newPassword.length >= i * 2 && newPassword.length < (i + 1) * 2
                          ? 'bg-orange-400'
                          : newPassword.length >= (i + 1) * 2
                            ? i < 3 ? 'bg-green-400' : 'bg-green-500'
                            : 'bg-gray-200'
                      )} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">
                    {newPassword.length < 4 ? 'Too short' : newPassword.length < 8 ? 'Weak – keep going' : 'Strong password ✓'}
                  </p>
                </div>
              )}
              <Button
                onClick={handleResetPassword}
                disabled={fpLoading || !newPassword || !confirmPassword}
                className="w-full bg-gradient-to-r from-[#5c5163] to-[#8b7a94] hover:from-[#7b6c83] hover:to-[#5c5163] text-white py-3 font-semibold transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
              >
                {fpLoading ? (
                  <span className="flex items-center gap-2">
                    <ArrowPathIcon className="w-4 h-4 animate-spin" /> Resetting...
                  </span>
                ) : 'Reset Password'}
              </Button>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <div className="text-center space-y-4 py-4">
              <p className="text-[#7b6c83] leading-relaxed">
                Your password has been reset successfully. You can now sign in with your new password.
              </p>
              <Button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-[#5c5163] to-[#8b7a94] hover:from-[#7b6c83] hover:to-[#5c5163] text-white py-3 font-semibold transition-all duration-300 hover:scale-[1.02]"
              >
                Back to Sign In
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Login Page ───────────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth() as { login: (email: string, password: string, loginAs?: 'PlatformAdmin' | 'InstitutionAdmin' | 'Supervisor') => Promise<boolean> };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginAsInstitution, setLoginAsInstitution] = useState(false);
  const [loginAsSupervisor, setLoginAsSupervisor] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let loginAs: 'PlatformAdmin' | 'InstitutionAdmin' | 'Supervisor' = 'PlatformAdmin';
      if (loginAsInstitution) {
        loginAs = 'InstitutionAdmin';
      } else if (loginAsSupervisor) {
        loginAs = 'Supervisor';
      }

      const success = await login(email, password, loginAs);
      if (success) {
        router.push('/home');
      } else {
        setError('Incorrect email or password');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#faf8fb] via-white to-[#f5f0f7] flex items-center justify-center p-4">
        {/* Floating Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Main Container */}
        <div className="w-full max-w-6xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden flex relative z-10 border border-white/50">
          {/* Left Side - Welcome Section */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#cdb4db] via-[#f8f4fa] to-[#faf8fb] relative overflow-hidden">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-20 left-20 w-32 h-32 border-2 border-purple-300 rounded-full animate-pulse"></div>
              <div className="absolute bottom-32 right-20 w-24 h-24 border-2 border-purple-300 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-1/2 left-1/3 w-16 h-16 border-2 border-purple-300 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
              <div className="absolute top-1/3 right-1/4 w-20 h-20 border border-purple-200 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            </div>

            {/* Gradient Orbs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

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
                  <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
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
                      autoComplete="off"
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
                      autoComplete="new-password"
                      required
                    />

                    {/* Login As Selection */}
                    <div className="grid grid-cols-1 gap-4">
                      {/* Login As Institution Admin Checkbox */}
                      <div className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer",
                        loginAsInstitution
                          ? "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-sm"
                          : "bg-gray-50 border-gray-100 hover:border-purple-100"
                      )}
                        onClick={() => {
                          setLoginAsInstitution(!loginAsInstitution);
                          if (!loginAsInstitution) setLoginAsSupervisor(false);
                        }}>
                        <input
                          type="checkbox"
                          id="loginAsInstitution"
                          checked={loginAsInstitution}
                          onChange={() => { }} // Handled by div onClick
                          className="w-5 h-5 text-[#5c5163] border-gray-300 rounded focus:ring-[#7b6c83] focus:ring-2 cursor-pointer accent-[#5c5163]"
                        />
                        <label
                          htmlFor="loginAsInstitution"
                          className="flex-1 text-sm font-medium text-[#5c5163] cursor-pointer select-none"
                        >
                          Login as Institution Admin
                        </label>
                      </div>

                      {/* Login As Supervisor Checkbox */}
                      <div className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer",
                        loginAsSupervisor
                          ? "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-sm"
                          : "bg-gray-50 border-gray-100 hover:border-purple-100"
                      )}
                        onClick={() => {
                          setLoginAsSupervisor(!loginAsSupervisor);
                          if (!loginAsSupervisor) setLoginAsInstitution(false);
                        }}>
                        <input
                          type="checkbox"
                          id="loginAsSupervisor"
                          checked={loginAsSupervisor}
                          onChange={() => { }} // Handled by div onClick
                          className="w-5 h-5 text-[#5c5163] border-gray-300 rounded focus:ring-[#7b6c83] focus:ring-2 cursor-pointer accent-[#5c5163]"
                        />
                        <label
                          htmlFor="loginAsSupervisor"
                          className="flex-1 text-sm font-medium text-[#5c5163] cursor-pointer select-none"
                          title="Login as Supervisor"
                        >
                          Login as Supervisor
                        </label>
                      </div>
                    </div>

                    {/* Remember & Forgot */}
                    <div className="flex items-center justify-between text-sm">
                      <button
                        type="button"
                        onClick={() => setShowForgotModal(true)}
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
                      onClick={() => router.push('/signUp')}
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

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />
      )}
    </>
  );
}
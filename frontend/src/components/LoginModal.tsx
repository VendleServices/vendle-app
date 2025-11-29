'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {X, Mail, Lock, Eye, EyeOff, User, Briefcase, Building2, Computer, Phone} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import vendleLogo from "../assets/vendle_logo.jpeg";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();
  const { login, signup } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [userType, setUserType] = useState<'homeowner' | 'contractor'>('homeowner');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email Required", {
        description: "Please enter your email address",
      });
      return;
    }

    if (!password) {
      toast.error("Password Required", {
        description: "Please enter your password",
      });
      return;
    }

    startTransition(async () => {
      let errorMessage;

      if (mode === 'login') {
        const { user, error } = await login(email, password);
        errorMessage = error ? "Error logging in.." : null;
      } else {
        const metadata = {
          userType,
          companyName,
          companyWebsite,
          phoneNumber,
        }
        const { user, error } = await signup(email, password, metadata);
        errorMessage = error ? "Error signing up.." : null;
      }

      if (!errorMessage) {
        toast.success("Success", {
          description: mode === 'login' ? 'Successfully logged in!' : 'Account created! Please check your email for confirmation.',
        });

        onClose();

        // Wait for auth state to sync, then redirect
        setTimeout(() => {
          window.location.href = '/home';
        }, 500);
      } else {
        toast.error("Error", {
          description: errorMessage,
        });
      }
    });
  };

  const handleGoogleAuth = () => {
    // TODO: Implement Google OAuth
    toast.info("Coming Soon", {
      description: "Google authentication will be available soon",
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 max-h-[90vh] overflow-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image src={vendleLogo} alt="Vendle Logo" width={64} height={64} className="h-16 w-16 rounded-lg" />
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-sm text-gray-600">
            {mode === 'login' ? 'Sign in to continue' : 'Sign up to get started'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Mail className="h-5 w-5" />
              </span>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isPending}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Lock className="h-5 w-5" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isPending}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* User Type Selection - Only show during signup */}
          {mode === 'signup' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Homeowner Option */}
                <button
                  type="button"
                  onClick={() => setUserType('homeowner')}
                  className={`flex items-center justify-center gap-2 p-4 border-2 rounded-lg transition-all ${
                    userType === 'homeowner'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                  disabled={isPending}
                >
                  <User className={`h-5 w-5 ${userType === 'homeowner' ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <span className="font-medium">Homeowner</span>
                </button>

                {/* Contractor Option */}
                <button
                  type="button"
                  onClick={() => setUserType('contractor')}
                  className={`flex items-center justify-center gap-2 p-4 border-2 rounded-lg transition-all ${
                    userType === 'contractor'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                  disabled={isPending}
                >
                  <Briefcase className={`h-5 w-5 ${userType === 'contractor' ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <span className="font-medium">Contractor</span>
                </button>
              </div>
            </div>
          )}

          {mode === 'signup' && userType === 'contractor' && (
              <div className="mb-4">
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Building2 className="h-5 w-5" />
                  </span>
                      <input
                          id="companyName"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="Enter Company Name"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isPending}
                      />
                </div>
              </div>
          )}

          {mode === 'signup' && userType === 'contractor' && (
              <div className="mb-4">
                <label htmlFor="companyWebsite" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Website
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Computer className="h-5 w-5" />
                  </span>
                  <input
                      id="companyWebsite"
                      value={companyWebsite}
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                      placeholder="Enter Company Website"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isPending}
                  />
                </div>
              </div>
          )}

          {mode === 'signup' && userType === 'contractor' && (
              <div className="mb-4">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Phone className="h-5 w-5" />
                  </span>
                  <input
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter Phone Number"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isPending}
                  />
                </div>
              </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium mb-3"
            disabled={isPending}
          >
            {isPending ? 'Loading...' : (mode === 'login' ? 'Login' : 'Sign Up')}
          </Button>
        </form>

        {/* Toeggle Mode */}
        <button
          onClick={() => {
            setMode(mode === 'login' ? 'signup' : 'login');
            setUserType('homeowner'); // Reset to default when switching modes
          }}
          className="w-full text-center text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          {mode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Login"}
        </button>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* Google Button */}
        <Button
          type="button"
          onClick={handleGoogleAuth}
          variant="outline"
          className="w-full border-gray-300 text-gray-700 py-3 rounded-lg font-medium flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </Button>
      </div>
    </div>
  );
}

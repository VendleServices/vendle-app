"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import { FadeTransition } from '@/lib/transitions';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, ArrowLeft, Eye, EyeOff, Building2, Phone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ContractorAuth = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();
  
  const queryParams = new URLSearchParams(location.search);
  const initialMode = queryParams.get('mode') === 'login' ? 'login' : 'signup';
  
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setPassword('');
    setConfirmPassword('');
    setCompanyName('');
    setPhoneNumber('');
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }
    
    if (!password) {
      toast({
        title: "Password Required",
        description: "Please enter your password",
        variant: "destructive"
      });
      return;
    }
    
    if (mode === 'signup') {
      if (!companyName) {
        toast({
          title: "Company Name Required",
          description: "Please enter your company name",
          variant: "destructive"
        });
        return;
      }
      
      if (!phoneNumber) {
        toast({
          title: "Phone Number Required",
          description: "Please enter your phone number",
          variant: "destructive"
        });
        return;
      }
      
      if (password !== confirmPassword) {
        toast({
          title: "Passwords Don't Match",
          description: "Please make sure your passwords match",
          variant: "destructive"
        });
        return;
      }
    }
    
    setIsLoading(true);
    setTimeout(() => {
      toast({
        title: mode === 'login' ? "Logged In Successfully" : "Signed Up Successfully",
        description: "Redirecting to contractor dashboard...",
      });
      
      setIsLoading(false);
      login(email, password);
      router.push('/reverse-auction');
    }, 1500);
  };
  
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-20">
      <FadeTransition>
        <div className="w-full max-w-md bg-white rounded-2xl shadow-medium p-8">
          <div className="mb-8 text-center">
            <button 
              onClick={() => router.push('/')}
              className="inline-flex items-center text-vendle-blue hover:text-vendle-blue/80 mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span>Back to Home</span>
            </button>
            
            <h1 className="text-2xl font-bold text-vendle-navy">
              {mode === 'login' ? 'Welcome Back, Contractor' : 'Join Our Contractor Network'}
            </h1>
            <p className="text-vendle-navy/70 mt-2">
              {mode === 'login' 
                ? 'Sign in to manage your projects' 
                : 'Connect with homeowners in need'}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <>
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-vendle-navy mb-1">
                    Company Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-vendle-navy/50">
                      <Building2 className="h-5 w-5" />
                    </span>
                    <input
                      id="companyName"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vendle-blue/20 focus:border-vendle-blue transition-colors"
                      placeholder="Enter your company name"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-vendle-navy mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-vendle-navy/50">
                      <Phone className="h-5 w-5" />
                    </span>
                    <input
                      id="phoneNumber"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vendle-blue/20 focus:border-vendle-blue transition-colors"
                      placeholder="Enter your phone number"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-vendle-navy mb-1">
                Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-vendle-navy/50">
                  <Mail className="h-5 w-5" />
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vendle-blue/20 focus:border-vendle-blue transition-colors"
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-vendle-navy mb-1">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-vendle-navy/50">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vendle-blue/20 focus:border-vendle-blue transition-colors"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-vendle-navy/50 hover:text-vendle-navy transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            {mode === 'signup' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-vendle-navy mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-vendle-navy/50">
                    <Lock className="h-5 w-5" />
                  </span>
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vendle-blue/20 focus:border-vendle-blue transition-colors"
                    placeholder="Confirm your password"
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}
            
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {mode === 'login' ? 'Log In' : 'Sign Up'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              onClick={toggleMode}
              className="text-sm text-vendle-navy/70 hover:text-vendle-navy transition-colors"
              disabled={isLoading}
            >
              {mode === 'login' 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Log in"}
            </button>
          </div>
        </div>
      </FadeTransition>
    </div>
  );
};

export default ContractorAuth; 
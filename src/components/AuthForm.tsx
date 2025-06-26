"use client"
import { useState, useTransition } from 'react';
import Button from '@/components/Button';
import { FadeTransition } from '@/lib/transitions';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { loginAction, signUpAction } from "@/actions/users";
import Link from "next/link";

type Props = {
    type: "login" | "signup"
}

const AuthForm = ({ type }: Props) => {
    const { toast } = useToast();
    const router = useRouter();
    const [isPending, startTransition] = useTransition()

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const email = formData.get('email') as string;
            const password = formData.get('password') as string;
            console.log(email);
            const confirmPassword = formData.get('confirmPassword');

            // Basic form validation
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

            if (type === 'signup' && password !== confirmPassword) {
                toast({
                    title: "Passwords Don't Match",
                    description: "Please make sure your passwords match",
                    variant: "destructive"
                });
                return;
            }

            let errorMessage;
            let description;

            if (type === 'login') {
                errorMessage = (await loginAction(email, password)).errorMessage;
                description = !errorMessage ? 'Successfully logged in!' : "Failed to log in";
            } else {
                errorMessage = (await signUpAction(email, password)).errorMessage;
                description = !errorMessage ? "Account Created" : "Error creating account";
            }

            if (!errorMessage) {
                toast({
                    title: "Success",
                    description,
                    variant: "default"
                });
                router.replace('/dashboard');
            } else {
                toast({
                    title: "Error",
                    description,
                    variant: "destructive"
                })
            }
        })
    };

    // Handle social authentication
    const handleSocialAuth = (provider: string) => {
        setIsLoading(true);

        // Simulate social auth
        setTimeout(() => {
            toast({
                title: `${provider} Authentication Successful`,
                description: "Redirecting to dashboard...",
            });

            setIsLoading(false);
            router.replace('/dashboard');
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
                            {type === 'login' ? 'Welcome Back' : 'Create Your Account'}
                        </h1>
                        <p className="text-vendle-navy/70 mt-2">
                            {type === 'login'
                                ? 'Sign in to continue your recovery journey'
                                : 'Join thousands rebuilding with confidence'}
                        </p>
                    </div>

                    <div className="space-y-4 mb-6">
                        <button
                            onClick={() => handleSocialAuth('Google')}
                            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-vendle-navy font-medium px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                            disabled={isLoading}
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    className="stroke-none fill-[#4285F4]"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    className="stroke-none fill-[#34A853]"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    className="stroke-none fill-[#FBBC05]"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    className="stroke-none fill-[#EA4335]"
                                />
                            </svg>
                            Continue with Google
                        </button>

                        <button
                            onClick={() => handleSocialAuth('Microsoft')}
                            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-vendle-navy font-medium px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                            disabled={isLoading}
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                <path
                                    fill="#f25022"
                                    d="M11.4 24H0V12.6h11.4V24z"
                                />
                                <path
                                    fill="#00a4ef"
                                    d="M24 24H12.6V12.6H24V24z"
                                />
                                <path
                                    fill="#7fba00"
                                    d="M11.4 11.4H0V0h11.4v11.4z"
                                />
                                <path
                                    fill="#ffb900"
                                    d="M24 11.4H12.6V0H24v11.4z"
                                />
                            </svg>
                            Continue with Microsoft
                        </button>
                    </div>

                    <div className="relative flex items-center my-6">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="mx-4 text-sm text-gray-500">or</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    <form action={handleSubmit} className="space-y-5">
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
                                    name="email"
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vendle-blue/20 focus:border-vendle-blue transition-colors"
                                    placeholder="Enter your email"
                                    disabled={isPending}
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
                                    name="password"
                                    className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vendle-blue/20 focus:border-vendle-blue transition-colors"
                                    placeholder="Enter your password"
                                    disabled={isPending}
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

                        {type === 'signup' && (
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
                                        name="confirmPassword"
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vendle-blue/20 focus:border-vendle-blue transition-colors"
                                        placeholder="Confirm your password"
                                        disabled={isPending}
                                    />
                                </div>
                            </div>
                        )}

                        {type === 'login' && (
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="text-sm text-vendle-blue hover:text-vendle-blue/80 transition-colors"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full py-3"
                            loading={isPending}
                        >
                            {type === 'login' ? 'Sign In' : 'Create Account'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-vendle-navy/70">
                            {type === 'login' ? "Don't have an account? " : "Already have an account? "}
                            <Link
                                href={type === "login" ? "/signup" : "/login"}
                                className="text-vendle-blue font-medium hover:text-vendle-blue/80 transition-colors"
                            >
                                {type === 'login' ? 'Sign up' : 'Sign in'}
                            </Link>
                        </p>
                    </div>

                    {type === 'login' && (
                        <div className="mt-6 text-center">
                            <p className="text-sm text-vendle-navy/70">
                                Are you a contractor?{' '}
                                <Link 
                                    href="/contractor-auth?mode=login" 
                                    className="text-vendle-blue hover:text-vendle-blue/80 font-medium"
                                >
                                    Login here
                                </Link>
                            </p>
                        </div>
                    )}
                </div>
            </FadeTransition>
        </div>
    );
};

export default AuthForm;
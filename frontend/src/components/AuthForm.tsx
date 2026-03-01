"use client"
import { useState, useTransition } from 'react';
import Button from '@/components/Button';
import { FadeTransition } from '@/lib/transitions';
import { Mail, Lock, Eye, EyeOff, Phone, Building2, Computer } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from "next/link";
import { toast } from "sonner";

type Props = {
    type: "login" | "signup" | "contractorsignup" | "contractorlogin"
}

const AuthForm = ({ type }: Props) => {
    const router = useRouter();
    const { login, signup } = useAuth();
    const [isPending, startTransition] = useTransition()

    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const formData = new FormData(e.currentTarget);
        const companyName = formData.get("companyName") as string;
        const companyWebsite = formData.get("companyWebsite") as string;
        const phoneNumber = formData.get("phoneNumber") as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword');

        // Basic form validation
        if (!email) {
            toast("Email Required", {
                description: "Please enter your email address",
            });
            return;
        }

        if (!password) {
            toast("Password Required", {
                description: "Please enter your password",
            });
            return;
        }

        if (type === 'signup' && password !== confirmPassword) {
            toast("Passwords don't match", {
                description: "Please make sure your passwords match",
            });
            return;
        }

        startTransition(async () => {
            let description;
            let errorMessage;

            if (type === 'login' || type === 'contractorlogin') {
                const { user, error } = await login(email, password);
                description = !error ? 'Successfully logged in!' : "Failed to log in";
                errorMessage = error ? "Error" : null;
            } else if (type === 'signup') {
                const metadata = {
                    userType: "homeowner"
                }
                const { user, error } = await signup(email, password, metadata);
                description = !error ? "Please check your email to confirm your account." : "Error creating account";
                errorMessage = error ? "Error" : null;
            } else if (type === 'contractorsignup') {
                const metadata = {
                    userType: "contractor",
                    companyName,
                    companyWebsite,
                    phoneNumber,
                }
                const { error, user } = await signup(email, password, metadata);
                description = !error ? "Please check your email to confirm your account." : "Error creating account";
                errorMessage = error ? "Error" : null;
            }

            if (!errorMessage) {
                toast("Success", {
                    description,
                });
                
                // Wait longer for the auth state and cookies to sync properly, then redirect
                setTimeout(async () => {
                    // Everyone goes to /home first, regardless of user type
                    // The detailed dashboards are accessed via navbar
                    window.location.href = '/home';
                }, 500);
            } else {
                toast("Error", {
                    description: errorMessage,
                });
            }
        });
    };

    return (
        <FadeTransition>
            <div className="w-full max-w-full sm:max-w-md bg-white rounded-2xl shadow-2xl border-2 border-[#D9D9D9]/30 overflow-hidden">
                    {/* Solid header accent */}
                    <div className="h-2 bg-[#2C3E50]" />

                    <div className="p-6 sm:p-8 lg:p-10">
                        <div className="mb-6 text-center">
                            <h1 className="text-2xl sm:text-3xl font-bold text-[#2C3E50] mb-2">
                                {type === 'login' ? 'Welcome Back' : 'Create Your Account'}
                            </h1>
                            <p className="text-sm sm:text-base text-[#2C3E50]/70">
                                {type === 'login'
                                    ? 'Sign in to continue your recovery journey'
                                    : type === 'contractorsignup'
                                    ? 'Join as a contractor and grow your business'
                                    : 'Join thousands rebuilding with confidence'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {type === 'contractorsignup' ? (
                                <div>
                                    <label htmlFor="companyName" className="block text-sm font-semibold text-[#2C3E50] mb-2">
                                        Company Name
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#4A637D]">
                                            <Building2 className="h-5 w-5" />
                                        </span>
                                        <input
                                            id="companyName"
                                            type="text"
                                            name="companyName"
                                            className="w-full pl-10 pr-4 py-3 border-2 border-[#D9D9D9] rounded-lg focus:ring-2 focus:ring-[#4A637D]/20 focus:border-[#4A637D] transition-all bg-white hover:border-[#4A637D]/50"
                                            placeholder="Enter Company Name"
                                            disabled={isPending}
                                        />
                                    </div>
                                </div>
                            ) : null}
                            {type === 'contractorsignup' ? (
                                <div>
                                    <label htmlFor="companyWebsite" className="block text-sm font-semibold text-[#2C3E50] mb-2">
                                        Company Website
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#4A637D]">
                                            <Computer className="h-5 w-5" />
                                        </span>
                                        <input
                                            id="companyWebsite"
                                            type="text"
                                            name="companyWebsite"
                                            className="w-full pl-10 pr-4 py-3 border-2 border-[#D9D9D9] rounded-lg focus:ring-2 focus:ring-[#4A637D]/20 focus:border-[#4A637D] transition-all bg-white hover:border-[#4A637D]/50"
                                            placeholder="Enter Company Website"
                                            disabled={isPending}
                                        />
                                    </div>
                                </div>
                            ) : null}
                            {type === 'contractorsignup' ? (
                                <div>
                                    <label htmlFor="phoneNumber" className="block text-sm font-semibold text-[#2C3E50] mb-2">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#4A637D]">
                                            <Phone className="h-5 w-5" />
                                        </span>
                                        <input
                                            id="phoneNumber"
                                            type="tel"
                                            name="phoneNumber"
                                            className="w-full pl-10 pr-4 py-3 border-2 border-[#D9D9D9] rounded-lg focus:ring-2 focus:ring-[#4A637D]/20 focus:border-[#4A637D] transition-all bg-white hover:border-[#4A637D]/50"
                                            placeholder="Enter Phone Number"
                                            disabled={isPending}
                                        />
                                    </div>
                                </div>
                            ) : null}
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-[#2C3E50] mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#4A637D]">
                                        <Mail className="h-5 w-5" />
                                    </span>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        className="w-full pl-10 pr-4 py-3 border-2 border-[#D9D9D9] rounded-lg focus:ring-2 focus:ring-[#4A637D]/20 focus:border-[#4A637D] transition-all bg-white hover:border-[#4A637D]/50"
                                        placeholder="Enter your email"
                                        disabled={isPending}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-semibold text-[#2C3E50] mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#4A637D]">
                                        <Lock className="h-5 w-5" />
                                    </span>
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        className="w-full pl-10 pr-10 py-3 border-2 border-[#D9D9D9] rounded-lg focus:ring-2 focus:ring-[#4A637D]/20 focus:border-[#4A637D] transition-all bg-white hover:border-[#4A637D]/50"
                                        placeholder="Enter your password"
                                        disabled={isPending}
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleShowPassword}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#4A637D] hover:text-[#2C3E50] transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            {type === 'signup' && (
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#2C3E50] mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#4A637D]">
                                            <Lock className="h-5 w-5" />
                                        </span>
                                        <input
                                            id="confirmPassword"
                                            type={showPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            className="w-full pl-10 pr-4 py-3 border-2 border-[#D9D9D9] rounded-lg focus:ring-2 focus:ring-[#4A637D]/20 focus:border-[#4A637D] transition-all bg-white hover:border-[#4A637D]/50"
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
                                        className="text-sm font-medium text-[#4A637D] hover:text-[#2C3E50] transition-colors"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                            )}

                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full py-3 sm:py-3.5 text-base sm:text-lg font-semibold bg-[#4A637D] hover:bg-[#4A637D]/90 shadow-lg hover:shadow-xl transition-all"
                                loading={isPending}
                            >
                                {type === 'login' ? 'Sign In' : 'Create Account'}
                            </Button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-sm sm:text-base text-[#2C3E50]/70">
                                {type === 'login' ? "Don't have an account? " : "Already have an account? "}
                                <Link
                                    href={type === "login" ? "/signup" : "/"}
                                    className="text-[#4A637D] font-semibold hover:text-[#2C3E50] transition-colors"
                                >
                                    {type === 'login' ? 'Sign up' : 'Sign in'}
                                </Link>
                            </p>
                        </div>

                        {type === 'login' && (
                            <div className="mt-4 text-center pb-2">
                                <p className="text-sm text-[#2C3E50]/70">
                                    Are you a contractor?{' '}
                                    <Link
                                        href="/contractor-signup"
                                        className="text-[#4A637D] hover:text-[#2C3E50] font-semibold transition-colors"
                                    >
                                        Sign Up As Contractor
                                    </Link>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </FadeTransition>
    );
};

export default AuthForm;
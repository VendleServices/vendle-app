import AuthForm from "@/components/AuthForm";

const SignUpPage = () => {
    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="w-full max-w-md mx-auto">
                    <AuthForm type="signup" />
                </div>
            </div>
        </div>
    )
}

export default SignUpPage;
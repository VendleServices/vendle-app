import AuthForm from "@/components/AuthForm";

const SignUpPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="container mx-auto px-4 py-20">
                <div className="flex justify-center">
                    <div className="w-full max-w-md">
                        <AuthForm type="signup" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUpPage;
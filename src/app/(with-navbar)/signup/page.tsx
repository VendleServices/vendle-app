import AuthForm from "@/components/AuthForm";
import { getUser } from "@/auth/server";
import { redirect } from "next/navigation";

const SignUpPage = async () => {
    const user = await getUser();

    if (user) {
        redirect("/dashboard");
    }

    return (
        <AuthForm type="signup" />
    )
}

export default SignUpPage;
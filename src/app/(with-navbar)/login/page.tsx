import AuthForm from "@/components/AuthForm";
import { getUser } from "@/auth/server";
import { redirect } from "next/navigation";

const LoginPage = async () => {
    const user = await getUser();

    if (user) {
        redirect("/dashboard");
    }

    return (
        <AuthForm type="login" />
    )
}

export default LoginPage;
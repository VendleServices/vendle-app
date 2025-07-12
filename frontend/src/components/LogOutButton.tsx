import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const LogOutButton = () => {
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <Button onClick={handleLogout}>
            Log Out
        </Button>
    )
}

export default LogOutButton;
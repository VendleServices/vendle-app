import { logOutAction } from "@/actions/users";
import { Button } from "@/components/ui/button";

const LogOutButton = () => {
    return (
        <Button onClick={logOutAction}>
            Log Out
        </Button>
    )
}

export default LogOutButton;
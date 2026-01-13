import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"

export const ProtectedRoute = ({children}) => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    if (loading) {
        return <div>Checking Authentication....</div>
    }

    if (!user) {
        navigate("/", { replace: true });
    }

    return children;
}
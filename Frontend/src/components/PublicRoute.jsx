import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // or loader

  return user ? <Navigate to="/dashboard" replace /> : children;
};

export default PublicRoute;

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import SpinnerFullPage from "../components/Spinner";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  // Show spinner while checking auth status
  if (loading) return <SpinnerFullPage />;

  // Only render children if authenticated
  return isAuthenticated ? children : null;
}

export default ProtectedRoute;

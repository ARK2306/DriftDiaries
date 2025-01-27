import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Spinner from "../components/Spinner";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("ProtectedRoute - auth state:", { user, loading });

    if (!loading && !user) {
      console.log("No authenticated user, redirecting to login");
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <Spinner />;
  }

  return user ? children : null;
}

export default ProtectedRoute;

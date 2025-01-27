import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Spinner from "../components/Spinner";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("ProtectedRoute effect running:", { user, loading });

    if (!loading && !user) {
      console.log("No user found, redirecting to login");
      navigate("/login", { replace: true });
    }
  }, [user, loading, navigate]);

  // Show spinner only during initial load
  if (loading && !user) {
    console.log("ProtectedRoute showing spinner");
    return <Spinner />;
  }

  // If we have a user, render the protected content
  if (user) {
    console.log("ProtectedRoute rendering protected content");
    return children;
  }

  // If we're not loading and have no user, return null (redirect will handle it)
  return null;
}

export default ProtectedRoute;

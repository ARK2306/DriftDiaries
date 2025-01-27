// src/components/ProtectedRoute.jsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Spinner from "../components/Spinner";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If we're still loading, don't do anything yet
    if (loading) return;

    // If user is not authenticated and we're done loading, redirect to login
    if (!user) {
      navigate("/login", { replace: true });
    } else if (location.hash) {
      // If we have a hash (from OAuth redirect) and we're authenticated,
      // clean up the URL by removing the hash
      navigate(location.pathname, { replace: true });
    }
  }, [user, loading, navigate, location]);

  if (loading) {
    return <Spinner />;
  }

  return user ? children : null;
}

export default ProtectedRoute;

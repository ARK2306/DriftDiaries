// src/components/ProtectedRoute.jsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Spinner from "./Spinner";
import { authUtils } from "../lib/supabase";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function handleRedirect() {
      // Check if we have a hash in the URL (OAuth redirect)
      if (location.hash && location.hash.includes("access_token")) {
        const { session, error } = await authUtils.handleAuthRedirect();
        if (error || !session) {
          console.error("Auth redirect error:", error);
          navigate("/login", { replace: true });
          return;
        }
      }

      // Normal authentication check
      if (!loading && !user) {
        navigate("/login", { replace: true });
      }
    }

    handleRedirect();
  }, [user, loading, navigate, location]);

  if (loading) {
    return <Spinner />;
  }

  return user ? children : null;
}

export default ProtectedRoute;

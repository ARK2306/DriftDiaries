import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Spinner from "../components/Spinner";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // Only run the effect if we're done loading and have user state
    if (!loading) {
      if (!user) {
        navigate("/", { replace: true });
      } else {
        setIsVerified(true);
      }
    }
  }, [user, loading, navigate]);

  // Show spinner only during initial load
  if (loading || !isVerified) {
    return <Spinner />;
  }

  // Only render children when user is verified
  return isVerified ? children : null;
}

export default ProtectedRoute;

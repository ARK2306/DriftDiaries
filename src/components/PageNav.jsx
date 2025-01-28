// PageNav.jsx
import { useNavigate } from "react-router-dom";
import styles from "./PageNav.module.css";
import { useAuth } from "../contexts/AuthContext";
import Logo from "./Logo";
import Button from "./Button";
import { signOut } from "../lib/supabaseAuth";
function PageNav() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  function handleLogin() {
    navigate("/login");
  }
  return (
    <nav className={styles.nav}>
      <div className={styles.logoContainer}>
        <Logo />
      </div>
      {isAuthenticated ? (
        <Button type="primary" onClick={handleLogout}>
          Logout
        </Button>
      ) : (
        <Button type="primary" onClick={handleLogin}>
          Login
        </Button>
      )}
    </nav>
  );
}

export default PageNav;

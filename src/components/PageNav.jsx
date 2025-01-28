// PageNav.jsx
import { useNavigate } from "react-router-dom";
import styles from "./PageNav.module.css";
import { useAuth } from "../contexts/AuthContext";
import Logo from "./Logo";
import Button from "./Button";
function PageNav() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      const { error } = await logout;
      if (error) throw error;
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

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

// PageNav.jsx
import { useNavigate } from "react-router-dom";
import styles from "./PageNav.module.css";
import { useAuth } from "../contexts/AuthContext";

function PageNav() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className={styles.nav}>
      <div className={styles.logoContainer}>
        <img
          src="/logo.png" // Direct reference to public folder
          alt="DriftDiaries"
          className={styles.logo}
        />
      </div>

      <button
        onClick={() => navigate(isAuthenticated ? "/app/cities" : "/login")}
        className={styles.button}
      >
        {isAuthenticated ? "Go to App" : "Login"}
      </button>
    </nav>
  );
}

export default PageNav;

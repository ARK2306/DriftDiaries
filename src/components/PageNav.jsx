// PageNav.jsx
import { useNavigate } from "react-router-dom";
import styles from "./PageNav.module.css";
import { useAuth } from "../contexts/AuthContext";
import Logo from "./Logo";
import Button from "./Button";
function PageNav() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className={styles.nav}>
      <div className={styles.logoContainer}>
        <Logo />
      </div>

      <Button
        onClick={() => navigate(isAuthenticated ? "/app/cities" : "/login")}
        type="primary"
      >
        {isAuthenticated ? "Go to App" : "Login"}
      </Button>
    </nav>
  );
}

export default PageNav;

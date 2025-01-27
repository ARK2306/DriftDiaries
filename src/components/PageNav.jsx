import { NavLink, useNavigate } from "react-router-dom";
import styles from "./PageNav.module.css";
import Logo from "./Logo";
import { useAuth } from "../contexts/AuthContext";
import Button from "./Button";
import { signOut } from "../lib/supabaseAuth";

function PageNav() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  function handleSubmit() {
    navigate("/login");
  }

  return (
    <nav className={styles.nav}>
      <Logo />
      <ul>
        <li>
          {isAuthenticated ? (
            <Button onClick={signOut} type="primary">
              Logout
            </Button>
          ) : (
            <Button onClick={handleSubmit} type="primary">
              Login
            </Button>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default PageNav;

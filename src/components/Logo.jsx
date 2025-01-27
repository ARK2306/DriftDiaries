import { Link } from "react-router-dom";
import styles from "./Logo.module.css";

function Logo() {
  return (
    <Link to="/">
      <img
        src="/logo.png"
        alt="logo"
        className={styles.logo}
        onError={(e) => {
          console.error("Logo failed to load:", e);
          e.target.onerror = null; // Prevent infinite loop
          e.target.src = "https://placehold.co/200x50?text=WorldWise"; // Fallback image
        }}
      />
    </Link>
  );
}

export default Logo;

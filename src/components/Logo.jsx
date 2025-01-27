import { Link } from "react-router-dom";
import styles from "./Logo.module.css";

function Logo() {
  return (
    <Link to="/">
      <img
        src="public/logo.png" // This will look for logo.png in the public folder
        alt="dd logo"
        className={styles.logo}
      />
    </Link>
  );
}

export default Logo;

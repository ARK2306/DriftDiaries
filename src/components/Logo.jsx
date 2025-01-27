import { Link } from "react-router-dom";
import styles from "./Logo.module.css";
import logoImage from "../public/images/logo.png";

function Logo() {
  return (
    <Link to="/">
      <img
        src={logoImage} // This will look for logo.png in the public folder
        alt="drift diaries logo"
        className={styles.logo}
      />
    </Link>
  );
}

export default Logo;

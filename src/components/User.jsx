// src/components/User.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styles from "./User.module.css";

function User() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout(e) {
    e.preventDefault();
    try {
      console.log("Initiating logout...");
      await logout();
      console.log("Logout successful, navigating to homepage");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  if (!profile) return null;

  return (
    <div className={styles.user}>
      <img
        src={
          profile.avatar_url ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            profile.full_name
          )}`
        }
        alt={profile.full_name}
      />
      <span>Welcome, {profile.full_name}</span>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default User;

import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styles from "./User.module.css";

function User() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <div className={styles.user}>
      <img
        src={
          user.user_metadata?.avatar_url ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user.user_metadata?.full_name || "User"
          )}`
        }
        alt={user.user_metadata?.full_name || "User avatar"}
      />
      <span>Welcome, {user.user_metadata?.full_name || "User"}!</span>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default User;

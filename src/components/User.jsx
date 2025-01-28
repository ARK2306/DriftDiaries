// src/components/User.jsx
import { useAuth } from "../contexts/AuthContext";
import styles from "./User.module.css";
import { signOut } from "../lib/supabaseAuth";

function User() {
  const { profile } = useAuth();

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

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

// Homepage.jsx
import { useNavigate } from "react-router-dom";
import PageNav from "../components/PageNav";
import styles from "./Homepage.module.css";
import { useAuth } from "../contexts/AuthContext";
import Spinner from "../components/Spinner";

export default function Homepage() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const handleStartMapping = () => {
    navigate(isAuthenticated ? "/app/cities" : "/login");
  };

  return (
    <main className={styles.homepage}>
      <PageNav />

      <section className={styles.section}>
        <h1 className={styles.title}>
          You travel the world.
          <br />
          DriftDiaries keeps track of your adventures.
        </h1>

        <h2 className={styles.description}>
          A world map that records your footsteps in every city you visit,
          helping you cherish your amazing experiences and share your global
          adventures with friends.
        </h2>

        {loading ? (
          <Spinner />
        ) : (
          <button onClick={handleStartMapping} className={styles.ctaButton}>
            {isAuthenticated ? "Go to your Adventure Log" : "Start Mapping"}
          </button>
        )}
      </section>
    </main>
  );
}

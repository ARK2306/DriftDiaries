import { useNavigate } from "react-router-dom";
import PageNav from "../components/PageNav";
import styles from "./Homepage.module.css";
import { useAuth } from "../contexts/AuthContext";
import Spinner from "../components/Spinner";
import Button from "../components/Button";

export default function Homepage() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const handleStartTracking = (e) => {
    e.preventDefault();
    navigate(isAuthenticated ? "/app/cities" : "/login");
  };

  return (
    <main className={styles.homepage}>
      <PageNav />
      <section>
        <h1>
          You travel the world.
          <br />
          DriftDiaries keeps track of your adventures.
        </h1>
        <h2>
          A world map that records your footsteps in every city you visit,
          helping you cherish your amazing experiences and share your global
          adventures with friends.
        </h2>
        {loading ? (
          <Spinner />
        ) : isAuthenticated ? (
          <Button onClick={handleStartTracking} type="primary">
            Go to your Adventure Log
          </Button>
        ) : (
          <Button onClick={handleStartTracking} type="primary">
            Start Mapping
          </Button>
        )}
      </section>
    </main>
  );
}

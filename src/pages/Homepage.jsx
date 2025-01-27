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
          WorldWise keeps track of your adventures.
        </h1>
        <h2>
          A world map that tracks your footsteps into every city you can think
          of. Never forget your wonderful experiences, and show your friends how
          you have wandered the world.
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

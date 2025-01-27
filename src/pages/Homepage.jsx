import { useNavigate } from "react-router-dom";
import PageNav from "../components/PageNav";
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
    <main className="min-h-screen bg-gray-800 relative">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(
            rgba(36, 42, 46, 0.8),
            rgba(36, 42, 46, 0.8)
          ), url('/images/bg.jpg')`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <PageNav />

        <section className="flex flex-col items-center justify-center px-4 py-20 text-center min-h-[85vh]">
          <h1 className="text-5xl font-bold text-white mb-6 max-w-4xl">
            You travel the world.
            <br />
            DriftDiaries keeps track of your adventures.
          </h1>

          <h2 className="text-xl text-gray-300 mb-12 max-w-3xl w-[90%]">
            A world map that records your footsteps in every city you visit,
            helping you cherish your amazing experiences and share your global
            adventures with friends.
          </h2>

          {loading ? (
            <Spinner />
          ) : (
            <Button onClick={handleStartTracking} type="primary">
              {isAuthenticated ? "Go to your Adventure Log" : "Start Mapping"}
            </Button>
          )}
        </section>
      </div>
    </main>
  );
}

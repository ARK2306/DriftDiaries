import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Spinner from "../components/Spinner";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchProfile(userId) {
    try {
      console.log("Fetching profile for user:", userId);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle(); // Use maybeSingle instead of single to avoid errors

      if (error) throw error;

      if (!data) {
        // Profile doesn't exist, create one
        console.log("Creating new profile for user:", userId);
        const { data: userData } = await supabase.auth.getUser();
        const {
          user: { user_metadata },
        } = userData;

        const newProfile = {
          id: userId,
          username: user_metadata.name || user_metadata.email,
          full_name: user_metadata.full_name || user_metadata.name,
          avatar_url: user_metadata.avatar_url || user_metadata.picture,
          updated_at: new Date().toISOString(),
        };

        const { data: createdProfile, error: createError } = await supabase
          .from("profiles")
          .upsert([newProfile])
          .select()
          .single();

        if (createError) throw createError;

        setProfile(createdProfile);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error("Error in fetchProfile:", error);
      setError(error.message);
    }
  }

  useEffect(() => {
    console.log("AuthProvider mounted");

    const initializeAuth = async () => {
      try {
        console.log("Initializing auth...");
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        console.log("Session:", session);

        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error("Error in initializeAuth:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);

      try {
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error("Error in auth state change:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      console.log("Cleaning up auth subscription");
      subscription?.unsubscribe();
    };
  }, []);

  async function logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error("Error in logout:", error);
      setError(error.message);
    }
  }

  if (error) {
    console.error("Auth error:", error);
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        error,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

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
        .maybeSingle();

      if (error) throw error;

      if (!data) {
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
          .maybeSingle();

        if (createError) throw createError;

        console.log("Created new profile:", createdProfile);
        return createdProfile;
      }

      console.log("Found existing profile:", data);
      return data;
    } catch (error) {
      console.error("Error in fetchProfile:", error);
      setError(error.message);
      return null;
    }
  }

  useEffect(() => {
    let mounted = true;
    console.log("AuthProvider mounted");

    const initializeAuth = async () => {
      try {
        console.log("Initializing auth...");
        setLoading(true);

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        console.log("Session:", session);

        if (session?.user && mounted) {
          setUser(session.user);
          const profileData = await fetchProfile(session.user.id);
          if (mounted) {
            setProfile(profileData);
          }
        }
      } catch (error) {
        console.error("Error in initializeAuth:", error);
        if (mounted) {
          setError(error.message);
        }
      } finally {
        if (mounted) {
          console.log("Setting loading to false");
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);

      if (!mounted) return;

      try {
        if (session?.user) {
          setUser(session.user);
          const profileData = await fetchProfile(session.user.id);
          if (mounted) {
            setProfile(profileData);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error("Error in auth state change:", error);
        if (mounted) {
          setError(error.message);
        }
      }
    });

    return () => {
      mounted = false;
      console.log("Cleaning up auth subscription");
      subscription?.unsubscribe();
    };
  }, []);

  async function logout() {
    try {
      console.log("Starting logout process...");
      setLoading(true);

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      console.log("Supabase signOut successful");

      // Clear all auth state
      setUser(null);
      setProfile(null);

      // Clear any local storage items if you have any
      localStorage.removeItem("supabase.auth.token");

      console.log("Auth state cleared");
      return { error: null };
    } catch (error) {
      console.error("Logout error:", error);
      setError(error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  }

  console.log("Auth state:", { loading, user, profile, error });

  // Only show spinner for initial load
  if (loading && !user && !profile) {
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

// src/contexts/AuthContext.jsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { supabase } from "../lib/supabase";
import { signOut } from "../lib/supabaseAuth";
import Spinner from "../components/Spinner";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Try to get initial user from localStorage
    const storedSession = localStorage.getItem("supabase.auth.token");
    return storedSession ? JSON.parse(storedSession).user : null;
  });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(
    async (userId) => {
      try {
        // Check if we already have the profile cached and it matches the current user
        if (profile?.id === userId) return profile;

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .maybeSingle();

        if (error) throw error;

        if (!data) {
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
          return createdProfile;
        }

        return data;
      } catch (error) {
        console.error("Error in fetchProfile:", error);
        setError(error.message);
        return null;
      }
    },
    [profile]
  );

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        setLoading(true);

        // First try to get the session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (session?.user && mounted) {
          setUser(session.user);
          // Store session in localStorage
          localStorage.setItem(
            "supabase.auth.token",
            JSON.stringify({ user: session.user })
          );
          const profileData = await fetchProfile(session.user.id);
          if (mounted) setProfile(profileData);
        } else if (!session && mounted) {
          // Clear stored data if no session
          localStorage.removeItem("supabase.auth.token");
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error("Error in initializeAuth:", error);
        if (mounted) setError(error.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log("Auth state changed:", event, session);

      try {
        if (session?.user) {
          setUser(session.user);
          // Update stored session
          localStorage.setItem(
            "supabase.auth.token",
            JSON.stringify({ user: session.user })
          );
          const profileData = await fetchProfile(session.user.id);
          if (mounted) setProfile(profileData);
        } else {
          // Clear stored data on signout
          localStorage.removeItem("supabase.auth.token");
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error("Error in auth state change:", error);
        if (mounted) setError(error.message);
      } finally {
        if (mounted) setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [fetchProfile]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      const { error } = await signOut();
      if (error) throw error;

      // Clear stored data on logout
      localStorage.removeItem("supabase.auth.token");
      return { error: null };
    } catch (error) {
      console.error("Error in logout:", error);
      setError(error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      profile,
      loading,
      error,
      logout,
      isAuthenticated: !!user,
    }),
    [user, profile, loading, error, logout]
  );

  if (loading && !user && !profile) {
    return <Spinner />;
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

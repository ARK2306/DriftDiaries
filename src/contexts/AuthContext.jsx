// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { signOut } from "../lib/supabaseAuth";
import Spinner from "../components/Spinner";

const STORAGE_KEY = "sb-uqpzvnyzkgfxdqqeirus-auth-token";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Try to get user from localStorage on initial render
    const storedSession = localStorage.getItem(STORAGE_KEY);
    if (storedSession) {
      try {
        const { user } = JSON.parse(storedSession);
        return user;
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchProfile(userId) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  }

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get current session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user && mounted) {
          setUser(session.user);
          const profileData = await fetchProfile(session.user.id);
          if (mounted) setProfile(profileData);
        } else if (!session && mounted) {
          // Clear state if no session
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
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

      console.log("Auth state changed:", event, session?.user?.id);

      if (session?.user) {
        setUser(session.user);
        const profileData = await fetchProfile(session.user.id);
        if (mounted) setProfile(profileData);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // If we have a user but no profile, fetch it
  useEffect(() => {
    if (user?.id && !profile) {
      fetchProfile(user.id).then((data) => setProfile(data));
    }
  }, [user]);

  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await signOut();
      if (error) throw error;

      // Clear state
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error("Error during logout:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Only show spinner during initial load
  if (loading && !user && !profile) {
    return <Spinner />;
  }

  const value = {
    user,
    profile,
    loading,
    error,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

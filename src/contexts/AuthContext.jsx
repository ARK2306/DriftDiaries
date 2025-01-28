// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { signOut } from "../lib/supabaseAuth";
import Spinner from "../components/Spinner";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => supabase.auth.getSession() || null);
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

    const initialize = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user && mounted) {
          console.log("Found session, setting user:", session.user);
          setUser(session.user);
          const profile = await fetchProfile(session.user.id);
          if (mounted) {
            console.log("Setting profile:", profile);
            setProfile(profile);
          }
        } else {
          console.log("No session found");
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error("Initialization error:", error);
        setError(error.message);
      } finally {
        if (mounted) {
          console.log("Setting loading to false");
          setLoading(false);
        }
      }
    };

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log("Auth state changed:", event, session);

      if (session?.user) {
        setUser(session.user);
        const profile = await fetchProfile(session.user.id);
        if (mounted) setProfile(profile);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      console.log("Cleaning up auth subscription");
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await signOut();
      if (error) throw error;
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error("Logout error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Only show spinner for initial load
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

  console.log("Current auth state:", value);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { signOut } from "../lib/supabaseAuth";
import Spinner from "../components/Spinner";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Try to get session from localStorage
    const persistedSession = localStorage.getItem(
      "sb-uqpzvnyzkgfxdqqeirus-auth-token"
    );
    if (persistedSession) {
      try {
        const parsedSession = JSON.parse(persistedSession);
        return parsedSession.user || null;
      } catch (error) {
        console.error("Error parsing stored session:", error);
        return null;
      }
    }
    return null;
  });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(!user); // Only show loading if no initial user
  const [error, setError] = useState(null);

  async function fetchProfile(userId) {
    if (!userId) return null;

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

  // Load initial profile if we have a user
  useEffect(() => {
    if (user && !profile) {
      fetchProfile(user.id).then((data) => setProfile(data));
    }
  }, [user]);

  useEffect(() => {
    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);

      if (session?.user) {
        setUser(session.user);
        const profileData = await fetchProfile(session.user.id);
        setProfile(profileData);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
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
      console.error("Error during logout:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Only show spinner if we're loading and don't have a user yet
  if (loading && !user) {
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

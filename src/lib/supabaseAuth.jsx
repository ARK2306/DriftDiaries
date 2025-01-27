// src/lib/supabaseAuth.js
import { supabase } from "./supabase";

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    // Clear any local storage
    window.localStorage.clear();

    // Force reload the page to clear all states
    window.location.href = "/";

    return { error: null };
  } catch (error) {
    console.error("Error during sign out:", error);
    return { error };
  }
};

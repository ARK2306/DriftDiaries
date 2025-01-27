// src/utils/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    storage: window.localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Authentication functions
export const authUtils = {
  // Sign up new user
  signUp: async (email, password, username, fullName) => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // Create profile for new user
      if (user) {
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: user.id,
            username,
            full_name: fullName,
            avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(
              fullName
            )}`,
          },
        ]);

        if (profileError) throw profileError;
      }

      return { user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  },

  // Sign in user
  signIn: async (email, password) => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/app/cities`,
          queryParams: {
            prompt: "select_account", // Forces Google to show account selector
            access_type: "offline", // Needed for refresh token
          },
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Google Sign In Error:", error);
      return { data: null, error };
    }
  },

  // Handle auth redirect
  handleAuthRedirect: async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;
      return { session, error: null };
    } catch (error) {
      console.error("Auth Redirect Error:", error);
      return { session: null, error };
    }
  },

  // Get current session
  getCurrentSession: async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;
      return { session, error: null };
    } catch (error) {
      console.error("Get Session Error:", error);
      return { session: null, error };
    }
  },

  // Sign out
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      return { user, error };
    } catch (error) {
      return { user: null, error };
    }
  },
};

// City blog functions
export const cityBlogUtils = {
  // Create new blog post
  createBlog: async (blogData) => {
    try {
      const { data, error } = await supabase
        .from("city_blogs")
        .insert([blogData])
        .select();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get all blogs for a user
  getUserBlogs: async (userId) => {
    try {
      const { data, error } = await supabase
        .from("city_blogs")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get a specific blog
  getBlog: async (blogId) => {
    try {
      const { data, error } = await supabase
        .from("city_blogs")
        .select("*")
        .eq("id", blogId)
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Update a blog
  updateBlog: async (blogId, updates) => {
    try {
      const { data, error } = await supabase
        .from("city_blogs")
        .update(updates)
        .eq("id", blogId)
        .select();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Delete a blog
  deleteBlog: async (blogId) => {
    try {
      const { error } = await supabase
        .from("city_blogs")
        .delete()
        .eq("id", blogId);

      return { error };
    } catch (error) {
      return { error };
    }
  },
};

// Storage functions
export const storageUtils = {
  // Upload image
  uploadImage: async (file, userId) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { data, error } = await supabase.storage
        .from("city-images")
        .upload(filePath, file);

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("city-images").getPublicUrl(filePath);

      return { publicUrl, error: null };
    } catch (error) {
      return { publicUrl: null, error };
    }
  },

  // Delete image
  deleteImage: async (filePath) => {
    try {
      const { error } = await supabase.storage
        .from("city-images")
        .remove([filePath]);

      return { error };
    } catch (error) {
      return { error };
    }
  },
};

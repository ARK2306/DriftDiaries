import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: null,
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };
    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: null,
      };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error("Unknown action type");
  }
}

function CitiesProvider({ children }) {
  const { user } = useAuth();
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  // Moved uploadPhoto inside CitiesProvider
  async function uploadPhoto(photoBase64) {
    try {
      const base64Data = photoBase64.split(",")[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/jpeg" });

      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.jpg`;

      const { data, error: uploadError } = await supabase.storage
        .from("city-images")
        .upload(fileName, blob, {
          contentType: "image/jpeg",
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("city-images").getPublicUrl(fileName);

      return { publicUrl, error: null };
    } catch (error) {
      console.error("Error uploading photo:", error);
      return { publicUrl: null, error };
    }
  }

  useEffect(() => {
    async function fetchCities() {
      if (!user) return;

      dispatch({ type: "loading" });
      try {
        const { data, error } = await supabase
          .from("cities")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        dispatch({ type: "cities/loaded", payload: data });
      } catch (error) {
        console.error("Error loading cities:", error);
        dispatch({
          type: "rejected",
          payload: "Error loading cities",
        });
      }
    }

    fetchCities();
  }, [user]);

  const getCity = useCallback(
    async function getCity(id) {
      if (!id || !user) return;

      dispatch({ type: "loading" });
      try {
        const { data: city, error } = await supabase
          .from("cities")
          .select("*")
          .eq("id", id)
          .eq("user_id", user.id)
          .single();

        if (error) throw error;
        dispatch({ type: "city/loaded", payload: city });
      } catch (error) {
        console.error("Error loading city:", error);
        dispatch({
          type: "rejected",
          payload: "Error loading city",
        });
      }
    },
    [user]
  );

  async function createCity(newCity) {
    if (!user) return;

    dispatch({ type: "loading" });
    try {
      const processedStories = await Promise.all(
        newCity.photo_stories.map(async (story) => {
          const { publicUrl, error } = await uploadPhoto(story.photo);
          if (error) throw error;

          return {
            url: publicUrl,
            story: story.story,
          };
        })
      );

      const { data, error } = await supabase
        .from("cities")
        .insert([
          {
            city_name: newCity.city_name,
            country: newCity.country,
            emoji: newCity.emoji,
            date: newCity.date,
            photo_stories: processedStories,
            position: newCity.position,
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      dispatch({ type: "city/created", payload: data });
      return data;
    } catch (error) {
      console.error("Error creating city:", error);
      dispatch({
        type: "rejected",
        payload: "Error creating city",
      });
      throw error;
    }
  }

  async function deleteCity(id) {
    if (!id || !user) return;

    dispatch({ type: "loading" });
    try {
      const { data: city, error: fetchError } = await supabase
        .from("cities")
        .select("photo_stories")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (fetchError) throw fetchError;

      if (city?.photo_stories?.length) {
        for (const story of city.photo_stories) {
          const fileName = story.url.split("/").pop();
          const { error: storageError } = await supabase.storage
            .from("city-images")
            .remove([fileName]);

          if (storageError)
            console.error("Error deleting photo:", storageError);
        }
      }

      const { error } = await supabase
        .from("cities")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
      dispatch({ type: "city/deleted", payload: id });
    } catch (error) {
      console.error("Error deleting city:", error);
      dispatch({
        type: "rejected",
        payload: "Error deleting city",
      });
      throw error;
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("Cities Context was used outside the provider");
  return context;
}

export { CitiesProvider, useCities };

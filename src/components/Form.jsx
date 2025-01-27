import { useEffect, useState } from "react";
import { useUrlPosition } from "../hooks/useUrlPosition";
import styles from "./Form.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import Message from "./Message";
import Spinner from "./Spinner";
import { useCities } from "../contexts/CitiesContext";
import { useAuth } from "../contexts/AuthContext";
import { validateAndResizeImage } from "./FlipCard";
import Alert from "./Alert";
import { Camera } from "lucide-react";
export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lat, lng] = useUrlPosition();
  const { createCity, isLoading } = useCities();
  const [alert, setAlert] = useState(null);
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [emoji, setEmoji] = useState("");
  const [photoStories, setPhotoStories] = useState([]);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [currentStory, setCurrentStory] = useState("");
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState("");

  useEffect(() => {
    if (!lat && !lng) return;

    async function fetchCityData() {
      try {
        setIsLoadingGeocoding(true);
        setGeocodingError("");

        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();

        if (!data.countryCode)
          throw new Error(
            "That doesn't seem to be a city. Click somewhere else."
          );

        const city = data.city || data.locality || data.name || "Unknown city";
        setCityName(city);
        setCountry(data.countryName);
        setEmoji(convertToEmoji(data.countryCode));
      } catch (err) {
        setGeocodingError(err.message);
      } finally {
        setIsLoadingGeocoding(false);
      }
    }

    fetchCityData();
  }, [lat, lng]);

  async function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const resizedBlob = await validateAndResizeImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentPhoto(reader.result);
      };
      reader.readAsDataURL(resizedBlob);
    } catch (error) {
      setAlert(error.message);
    }
  }

  function handleAddStory(e) {
    e.preventDefault();
    if (!currentPhoto || !currentStory.trim() || photoStories.length >= 3)
      return;

    setPhotoStories((prev) => [
      ...prev,
      { photo: currentPhoto, story: currentStory },
    ]);
    setCurrentPhoto(null);
    setCurrentStory("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!cityName || !date || photoStories.length === 0) return;

    const newCity = {
      city_name: cityName,
      country,
      emoji,
      date,
      position: { lat, lng },
      photo_stories: photoStories,
      user_id: user.id,
    };

    try {
      await createCity(newCity);
      navigate("/app/cities");
    } catch (err) {
      setGeocodingError("Failed to create city. Please try again.");
    }
  }

  if (isLoadingGeocoding) return <Spinner />;
  if (!lat && !lng) return <Message message="Start by clicking on the map" />;
  if (geocodingError) return <Message message={geocodingError} />;

  return (
    <div className="min-h-screen bg-gray-800 px-8 py-4">
      <form
        className={`${styles.form} ${isLoading ? styles.loading : ""}`}
        onSubmit={handleSubmit}
      >
        {alert && <Alert message={alert} onClose={() => setAlert(null)} />}

        <div className={styles.row}>
          <label>City name</label>
          <input
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            className="w-full p-2 rounded bg-gray-100 text-gray-800"
          />
          <span className={styles.flag}>{emoji}</span>
        </div>

        <div className={styles.row}>
          <label>When did you go to {cityName}?</label>
          <DatePicker
            selected={date}
            onChange={(date) => setDate(date)}
            dateFormat="dd/MM/yyyy"
            className="w-full p-2 rounded bg-gray-100 text-gray-800"
          />
        </div>

        <div className={styles.row}>
          <label>Add Memory ({photoStories.length}/3 photos)</label>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              disabled={photoStories.length >= 3}
              className="hidden"
              id="photo-upload"
            />
            <label
              htmlFor="photo-upload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              Choose Photo
            </label>

            <div className="text-sm mb-4">
              <p className="text-gray-300">For best results:</p>
              <ul className="list-disc ml-4 text-gray-400">
                <li>Image should be at least 190x254 pixels</li>
                <li>Portrait orientation recommended</li>
                <li>Will be automatically resized to fit</li>
              </ul>
            </div>

            {currentPhoto && (
              <div className="mt-4">
                <div className="relative w-[190px] h-[254px]">
                  <img
                    src={currentPhoto}
                    alt="Preview"
                    className="absolute inset-0 w-full h-full object-cover rounded"
                  />
                </div>

                <div className="mt-4">
                  <textarea
                    value={currentStory}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 300) setCurrentStory(value);
                    }}
                    placeholder="Write your story about this photo (Max 300 characters)"
                    className="w-full p-2 rounded bg-gray-100 text-gray-800 resize-none"
                    rows={4}
                    maxLength={300}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-500">
                      {300 - currentStory.length} characters remaining
                    </span>
                    {currentStory.length === 0 ? (
                      <Button type="disabled" disabled>
                        Add you story
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        onClick={handleAddStory}
                        disabled={!currentStory.trim()}
                      >
                        Add Memory
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {photoStories.length > 0 && (
              <div className="mt-6 space-y-4">
                <h3 className="font-medium text-gray-300">Added Memories:</h3>
                <div className="grid grid-cols-2 gap-4">
                  {photoStories.map((story, index) => (
                    <div key={index} className="bg-gray-700 p-3 rounded-lg">
                      <div className="relative w-full pt-[75%]">
                        <img
                          src={story.photo}
                          alt={`Story ${index + 1}`}
                          className="absolute inset-0 w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-300 line-clamp-3">
                        {story.story}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.buttons}>
          {photoStories.length === 0 ? (
            <Button disabled type="disabled">
              Add Stories to continue
            </Button>
          ) : (
            <Button type="primary">Add</Button>
          )}
          <BackButton />
        </div>
      </form>
    </div>
  );
}

export default Form;

import { useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./City.module.css";
import { useCities } from "../contexts/CitiesContext";
import Spinner from "./Spinner";
import BackButton from "./BackButton";
import FlipCard from "./FlipCard";

function City() {
  const { id } = useParams();
  const { getCity, currentCity, isLoading } = useCities();

  useEffect(() => {
    getCity(id);
  }, [id, getCity]);

  if (isLoading) return <Spinner />;
  if (!currentCity) return null;

  const { city_name, emoji, date, photo_stories } = currentCity;

  return (
    <div className={styles.city}>
      <div>
        <p className="text-gray-500 text-sm">City name</p>
        <p className="flex items-center gap-2 text-xl mt-1">
          <span>{emoji}</span> {city_name}
        </p>
      </div>

      <div>
        <p className="text-gray-500 text-sm">Visit Date</p>
        <p className="mt-1">
          {date &&
            new Date(date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
        </p>
      </div>

      <div>
        <p className="text-gray-500 text-sm mb-5">Photo Stories</p>
        <br />
        <div className="flex flex-wrap gap-6">
          {photo_stories?.map((story, index) => (
            <FlipCard key={index} photo={story.url} story={story.story} />
          ))}
        </div>
      </div>

      <BackButton />
    </div>
  );
}

export default City;

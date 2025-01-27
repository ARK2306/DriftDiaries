import CountryItem from "./CountryItem";
import styles from "./CountriesList.module.css";
import Spinner from "./Spinner";
import Message from "./Message";
import { useCities } from "../contexts/CitiesContext";
function CountryList() {
  const { cities, isLoading } = useCities();
  if (isLoading) return <Spinner />;
  if (!cities.length) return <Message message="Add a city to view countries" />;

  const countries = cities.reduce((arr, city) => {
    if (!arr.map((el) => el.country).includes(city.country)) {
      return [
        ...arr,
        {
          country: city.country,
          emoji: city.emoji,
          id: `${city.country}-${city.emoji}`,
        },
      ];
    } else {
      return arr;
    }
  }, []);
  return (
    <div>
      <ul className={styles.countryList}>
        {countries.map((country) => (
          <CountryItem country={country} key={country.id} />
        ))}
      </ul>
    </div>
  );
}

export default CountryList;

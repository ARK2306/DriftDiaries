import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim() || query.length < 3) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&limit=5`
        );
        const data = await res.json();

        if (data) {
          setResults(
            data.map((result) => ({
              name: result.display_name,
              lat: result.lat,
              lng: result.lon,
            }))
          );
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the search
    const timeoutId = setTimeout(fetchResults, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  function handleSelectLocation(result) {
    navigate(`/app/form?lat=${result.lat}&lng=${result.lng}`);
    setResults([]);
    setQuery("");
  }

  return (
    <StyledWrapper>
      <div className="group">
        <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
          <g>
            <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" />
          </g>
        </svg>
        <input
          type="search"
          className="input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a city..."
        />
      </div>

      {results.length > 0 && (
        <div className="results">
          {results.map((result, index) => (
            <button
              key={index}
              onClick={() => handleSelectLocation(result)}
              className="result-item"
            >
              {result.name}
            </button>
          ))}
        </div>
      )}
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  position: absolute;
  left: 50%;
  top: 2rem;
  transform: translateX(-50%);
  z-index: 1000;
  width: min(90%, 400px);

  .group {
    display: flex;
    line-height: 28px;
    align-items: center;
    position: relative;
    width: 100%;
  }

  .input {
    width: 100%;
    height: 45px;
    line-height: 28px;
    padding: 0 1rem;
    padding-left: 2.5rem;
    border: 2px solid transparent;
    border-radius: 8px;
    outline: none;
    background-color: #f3f3f4;
    color: #0d0c22;
    transition: 0.3s ease;
    font-size: 16px;
  }

  .input::placeholder {
    color: #9e9ea7;
  }

  .input:focus,
  .input:hover {
    outline: none;
    border-color: rgba(234, 76, 137, 0.4);
    background-color: #fff;
    box-shadow: 0 0 0 4px rgb(234 76 137 / 10%);
  }

  .icon {
    position: absolute;
    left: 1rem;
    fill: #9e9ea7;
    width: 1rem;
    height: 1rem;
  }

  .results {
    margin-top: 0.5rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    overflow: hidden;
    max-height: 300px;
    overflow-y: auto;
  }

  .result-item {
    width: 100%;
    text-align: left;
    padding: 0.75rem 1rem;
    background: none;
    border: none;
    color: #0d0c22;
    font-size: 14px;
    transition: background-color 0.2s;
    cursor: pointer;

    &:hover {
      background-color: #f3f3f4;
    }

    & + & {
      border-top: 1px solid #eee;
    }
  }
`;

export default SearchBox;

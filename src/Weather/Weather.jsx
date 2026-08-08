import React, { useState } from "react";
import "./Weather.css";

function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const apiKey = "5f5745de622197af1ab2fed59c0e7805";

  const getWeather = async () => {
    if (city.trim() === "") {
      setError("Please enter city name");
      setWeather(null);
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city
        )}&appid=${apiKey}&units=metric`
      );

      const data = await response.json();

      console.log("Weather API Response:", data);

      if (!response.ok) {
        if (data.cod === 401) {
          setError("API Key invalid or not activated.");
        } else if (data.cod === 404) {
          setError("City not found. Please enter a correct city name.");
        } else {
          setError(data.message || "Unable to get weather information.");
        }

        return;
      }

      setWeather(data);
    } catch (err) {
      console.log("Weather Error:", err);
      setError(
        "Internet connection problem. Please check your internet and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      getWeather();
    }
  };

  return (
    <div className="weather-container">
      <div className="weather-box">

        {/* Heading */}
        <div className="weather-header">
          <div className="weather-icon">☀️</div>

          <h1>Weather App</h1>

          <p>Check current weather of any city</p>
        </div>

        {/* Search */}
        <div className="weather-search">

          <input
            type="text"
            className="weather-input"
            placeholder="Enter City Name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button
            className="weather-button"
            onClick={getWeather}
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>

        </div>

        {/* Error */}
        {error && (
          <div className="weather-error">
            ⚠️ {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="weather-loading">
            <div className="weather-spinner"></div>
            <p>Getting weather information...</p>
          </div>
        )}

        {/* Weather Information */}
        {weather && !loading && (
          <div className="weather-info">

            <h2>{weather.name}</h2>

            <p className="weather-country">
              {weather.sys?.country}
            </p>

            <img
              className="weather-image"
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />

            <div className="weather-temperature">
              {Math.round(weather.main.temp)}°C
            </div>

            <div className="weather-condition">
              {weather.weather[0].main}
            </div>

            <p className="weather-description">
              {weather.weather[0].description}
            </p>

            <div className="weather-details">

              <div className="weather-detail-card">
                <span className="detail-icon">💧</span>

                <div>
                  <p>Humidity</p>
                  <strong>
                    {weather.main.humidity}%
                  </strong>
                </div>
              </div>

              <div className="weather-detail-card">
                <span className="detail-icon">💨</span>

                <div>
                  <p>Wind Speed</p>
                  <strong>
                    {weather.wind.speed} m/s
                  </strong>
                </div>
              </div>

              <div className="weather-detail-card">
                <span className="detail-icon">🌡️</span>

                <div>
                  <p>Feels Like</p>
                  <strong>
                    {Math.round(weather.main.feels_like)}°C
                  </strong>
                </div>
              </div>

              <div className="weather-detail-card">
                <span className="detail-icon">📊</span>

                <div>
                  <p>Pressure</p>
                  <strong>
                    {weather.main.pressure} hPa
                  </strong>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default Weather;
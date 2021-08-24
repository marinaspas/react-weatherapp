import React, { useEffect, useState } from "react";

const api = {
  key: process.env.REACT_APP_OPENWEATHER_API_KEY,
  base: "https://api.openweathermap.org/data/2.5/",
};
function App() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({});
  const [unitType, setUnitType] = useState("metric");
  const failedSearches = localStorage.hasOwnProperty("failed_searches")
    ? JSON.parse(localStorage.getItem("failed_searches"))
    : [];
  useEffect(() => {
    if (!isFailedSearch(query) && query.length > 0) {
      fetch(
        `${api.base}weather?q=${query}&units=${unitType}&appid=${api.key}`
      ).then(async (data) => {
        if (data.ok) {
          const res = await data.json();
          setWeather(res);
        } else {
          localStorage.setItem(
            "failed_searches",
            JSON.stringify([...failedSearches, query])
          );
        }
      });
    }
  }, [query, unitType]);

  var options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  let date = new Date();
  date = date.toLocaleDateString("en-US", options);

  const isFailedSearch = (q) => {
    return failedSearches.includes(q);
  };
  const getWeatherClass = (response) => {
    if (typeof response.main != "undefined") {
      if (response.main.temp > 25) {
        return "app hot";
      } else if (response.main.temp > 20 && response.main.temp <= 25) {
        return "app warm";
      } else if (response.main.temp > 1) {
        return "app cold";
      } else if (response.main.temp < 0) {
        return "app very-cold";
      }
    } else {
      return "app";
    }
  };

  const changeMetricString = () => {
    if (unitType === "metric") {
      return "C";
    } else {
      return "F";
    }
  };

  return (
    <div className={getWeatherClass(weather)}>
      <main>
        <div className="search-box">
          <input
            type="text"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            className="search-bar"
            placeholder="Search a City"
          />
        </div>

        {typeof weather.main != "undefined" ? (
          <div className="container">
            <div className="location-box">
              <div className="location">
                <div className="img-wrap">
                  <img
                    src={
                      "https://openweathermap.org/img/wn/" +
                      weather.weather[0].icon +
                      "@2x.png"
                    }
                    alt={weather.weather[0].description + " icon"}
                  />
                </div>
                <span className="location-name">
                  {weather.name}, {weather.sys.country}
                </span>
              </div>
              <div className="date">{date}</div>
            </div>
            <button
              className="metric-btn"
              onClick={() => {
                const newType = unitType === "metric" ? "imperial" : "metric";
                fetch(
                  `${api.base}weather?q=${query}&units=${newType}&APPID=${api.key}`
                )
                  .then((res) => res.json())
                  .then((result) => {
                    setWeather(result);
                    setUnitType(newType);
                  });
              }}
            >
              {unitType === "metric" ? "imperial" : "metric"}
            </button>
            <div className="weather-box">
              <div className="temp">
                {Math.round(weather.main.temp)}
                <span>&deg;</span>
                {changeMetricString()}
              </div>
              <div className="weather-details">
                <p className="weather">{weather.weather[0].description}</p>
                <p>{weather.weather.description}</p>
                <p>
                  Feels like: {Math.round(weather.main.feels_like)}&deg;
                  {changeMetricString()}
                </p>
                <p>Humidity: {weather.main.humidity}%</p>
                <p>Pressure: {weather.main.pressure} hPa</p>
                <p>
                  Min Temp: {Math.round(weather.main.temp_min)}&deg;
                  {changeMetricString()}
                </p>
                <p>
                  Max Temp: {Math.round(weather.main.temp_max)}&deg;
                  {changeMetricString()}
                </p>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </main>
    </div>
  );
}

export default App;

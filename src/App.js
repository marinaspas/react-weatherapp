import "./App.css";
import React, { useState } from "react";

const api = {
  key: process.env.REACT_APP_OPENWEATHER_API_KEY,
  base: "https://api.openweathermap.org/data/2.5/",
};
function App() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({});
  const [unitType, setUnitType] = useState("metric");

  const search = (evt) => {
    if (evt.key === "Enter") {
      fetch(`${api.base}weather?q=${query}&units=${unitType}&APPID=${api.key}`)
        .then((res) => res.json())
        .then((result) => {
          setWeather(result);
          console.log(result, "this is result");
        });
    }
  };

  var options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  let date = new Date();
  date = date.toLocaleDateString("en-US", options);

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
            placeholder="Search ..."
            onKeyPress={search}
          />
        </div>

        {typeof weather.main != "undefined" ? (
          <div className="container">
            <div className="location-box">
              <div className="location">
                {weather.name}, {weather.sys.country}
              </div>
              <div className="date">{date}</div>
            </div>
            <div className="weather-box">
              <div className="temp">
                {Math.round(weather.main.temp)}&deg; {changeMetricString()}
              </div>
              <div className="weather">{weather.weather[0].main}</div>
              <div>{weather.weather.description}</div>
              <div>
                Feels like {Math.round(weather.main.feels_like)}&deg;{" "}
                {changeMetricString()}
              </div>
              <div>Humidity {weather.main.humidity}%</div>
              <div>Pressure {weather.main.pressure} hPa</div>
              <div>
                Min Temp {Math.round(weather.main.temp_min)}&deg;{" "}
                {changeMetricString()}
              </div>
              <div>
                Max Temp {Math.round(weather.main.temp_max)}&deg;{" "}
                {changeMetricString()}
              </div>
              <div>{weather.weather[0].description}</div>
              <div>
                <img
                  src={
                    "http://openweathermap.org/img/wn/" +
                    weather.weather[0].icon +
                    "@4x.png"
                  }
                  alt="icon"
                />
              </div>

              <button
                onClick={() => {
                  const newType = unitType === "metric" ? "imperial" : "metric";
                  fetch(
                    `${api.base}weather?q=${query}&units=${newType}&APPID=${api.key}`
                  )
                    .then((res) => res.json())
                    .then((result) => {
                      setWeather(result);
                      setUnitType(newType);
                      console.log(result, "this is result");
                    });
                }}
              >
                switch to {unitType === "metric" ? "imperial" : "metric"}
              </button>
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

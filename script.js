const API_KEY = "cc7a94d71d4359c630e4f4daafa293c3";

// DOM ELEMENTS

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherCard = document.getElementById("weatherCard");
const forecast = document.getElementById("Forecast");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const favoritesList = document.getElementById("favoritesList");
const favoritesSidebar = document.getElementById("favoritesSidebar");
const closeFavorites = document.getElementById("closeFavorites");
const overlay = document.getElementById("overlay");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  const response = await fetch(url);

  if (!response.ok) {
    const data = await response.json();

    throw new Error(data.message);
  }

  return await response.json();
}

// FORECAST

async function getForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

  const response = await fetch(url);

  if (!response.ok) {
    const data = await response.json();

    throw new Error(data.message);
  }

  return await response.json();
}

// SEARCH WEATHER

async function searchWeather() {
  const city = cityInput.value.trim();

  if (city === "") {
    error.textContent = "Please enter a city";

    return;
  }

  try {
    loading.style.display = "block";

    error.textContent = "";

    weatherCard.style.display = "none";
    const data = await getWeather(city);
    const forecastData = await getForecast(city);
    weatherCard.innerHTML = `

      <button id="saveBtn">
        ⭐ Save
      </button>

      <h2>📍 ${data.name}</h2>

      <p>🌡️ Temperature: ${Math.round(data.main.temp)}°C </p>

      <p> 🤔 Feels Like: ${Math.round(data.main.feels_like)}°C </p>

      <p> ☁️ Weather: ${data.weather[0].description} </p>

      <p>💧 Humidity: ${data.main.humidity}% </p>

      <p>💨 Wind: ${data.wind.speed} m/s </p>
    `;

    weatherCard.style.display = "block";

    const saveBtn = document.getElementById("saveBtn");

    saveBtn.addEventListener("click", function () {
      const cityName = data.name;

      if (favorites.includes(cityName)) {
        alert("City already saved!");

        return;
      }
      favorites.push(cityName);

      localStorage.setItem("favorites", JSON.stringify(favorites));

      displayFavorites();

      console.log("Saved:", cityName);
      console.log("Favorites:", favorites);
    });

    // 5 DAY FORECAST

    const fiveDays = forecastData.list.filter((item) =>
      item.dt_txt.includes("12:00:00"),
    );

    forecast.innerHTML = "";

    fiveDays.forEach((day) => {
      forecast.innerHTML += `
        <div class="forecast-card">
          <h3> ${day.dt_txt.split(" ")[0]} </h3>

          <p> 🌡️ ${Math.round(day.main.temp)}°C </p>

          <p> ☁️ ${day.weather[0].description} </p>

          <p>💧 ${day.main.humidity}%</p>
        </div>
      `;
    });
  } catch (err) {
    error.textContent = err.message;
  } finally {
    loading.style.display = "none";
  }
}

// DISPLAY FAVORITES

function displayFavorites() {
  favoritesList.innerHTML = "";

  favorites.forEach((city) => {
    favoritesList.innerHTML += `

      <div class="favorite-city">

      <button class="city-btn" data-city="${city}">
          📍 ${city}
        </button>

        <button
          class="remove-btn"
          data-city="${city}"
        >
          ❌
        </button>

      </div>

    `;
  });
}

favoritesList.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-btn")) {
    const city = event.target.dataset.city;
    favorites = favorites.filter((favorite) => favorite !== city);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayFavorites();
    console.log("Removed:", city);
  }
});

favoritesList.addEventListener("click", (event) => {
  if (event.target.classList.contains("city-btn")) {
    const city = event.target.dataset.city;

    cityInput.value = city;

    searchWeather();
  }
});

searchBtn.addEventListener("click", searchWeather);

displayFavorites();

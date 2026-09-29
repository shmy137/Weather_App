const API_KEY = "051f6796a24c2402663a0b1d3f212459";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherCard = document.getElementById("weatherCard");
const forecast = document.getElementById("Forecast");
const loading = document.getElementById("loading");
const error = document.getElementById("error");

async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  const response = await fetch(url);

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message);
  }

  const data = await response.json();

  return data;
}

async function getForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

  const response = await fetch(url);

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message);
  }

  const data = await response.json();

  return data;
}

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

    // Current weather
    const data = await getWeather(city);

    // 5-day forecast
    const forecastData = await getForecast(city);

    // CURRENT WEATHER

    weatherCard.innerHTML = `
            <h2>📍 ${data.name}</h2>

            <p>🌡️ Temperature: ${Math.round(data.main.temp)}°C</p>

            <p>🤔 Feels Like: ${Math.round(data.main.feels_like)}°C</p>

            <p>☁️ Weather: ${data.weather[0].description}</p>

            <p>💧 Humidity: ${data.main.humidity}%</p>

            <p>💨 Wind: ${data.wind.speed} m/s</p>
        `;

    weatherCard.style.display = "block";

    // 5-DAY FORECAST

    const fiveDays = forecastData.list.filter((item) =>
      item.dt_txt.includes("12:00:00"),
    );

    forecast.innerHTML = "";

    fiveDays.forEach((day) => {
      forecast.innerHTML += `
                <div class="forecast-card">

                    <h3>${day.dt_txt.split(" ")[0]}</h3>

                    <p>🌡️ ${Math.round(day.main.temp)}°C</p>

                    <p>☁️ ${day.weather[0].description}</p>

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

searchBtn.addEventListener("click", searchWeather);

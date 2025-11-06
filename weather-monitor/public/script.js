// State Management
const state = {
  currentCity: null,
  currentWeather: null,
  favorites: JSON.parse(localStorage.getItem("favorites")) || [],
  settings: JSON.parse(localStorage.getItem("settings")) || {
    unit: "celsius",
    theme: "light",
    notifications: false,
  },
};

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
  applySettings();
  loadDefaultCity();
  setUpEventListeners();
});

// Event Listeners
function setUpEventListeners() {
  document.getElementById("cityInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchWeather();
  });
}

// Show Page Function
function showPage(pageName) {
  // Hide all pages
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active");
  });

  // Remove active class from all nav links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
  });

  // Show selected page
  document.getElementById(pageName).classList.add("active");

  // Add active to clicked link
  event.target.classList.add("active");

  // Load page-specific data
  if (pageName === "forecast") loadForecast();
  if (pageName === "favorites") displayFavorites();
}

// Load Default City
async function loadDefaultCity() {
  const defaultCity = localStorage.getItem("defaultCity") || "London";
  await fetchWeather(defaultCity);
}

// Search Weather
async function searchWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (city) {
    await fetchWeather(city);
    localStorage.setItem("defaultCity", city);
  }
}

// Fetch Weather Data
async function fetchWeather(city) {
  try {
    showLoading();
    const response = await fetch(`/api/weather/${city}`);

    if (!response.ok) throw new Error("City not found");

    const data = await response.json();
    state.currentWeather = data;
    state.currentCity = city;

    displayWeather(data);
    document.getElementById("cityInput").value = "";
  } catch (error) {
    showError(error.message || "Failed to fetch weather data");
  }
}

// Display Weather Data
function displayWeather(data) {
  const card = document.getElementById("currentWeather");

  // Update data
  document.getElementById(
    "cityName"
  ).textContent = `${data.name}, ${data.sys.country}`;
  document.getElementById(
    "lastUpdated"
  ).textContent = `Updated ${new Date().toLocaleTimeString()}`;

  const temp =
    state.settings.unit === "fahrenheit"
      ? (data.main.temp * 9) / 5 + 32
      : data.main.temp;

  document.getElementById("temperature").textContent = `${Math.round(temp)}°${
    state.settings.unit === "fahrenheit" ? "F" : "C"
  }`;
  document.getElementById("description").textContent =
    data.weather[0].description;

  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  document.getElementById("weatherIcon").src = iconUrl;

  document.getElementById("humidity").textContent = `${data.main.humidity}%`;
  document.getElementById("windSpeed").textContent = `${data.wind.speed} m/s`;
  document.getElementById("pressure").textContent = `${data.main.pressure} hPa`;
  document.getElementById("visibility").textContent = `${(
    data.visibility / 1000
  ).toFixed(1)} km`;

  const feelsLike =
    state.settings.unit === "fahrenheit"
      ? (data.main.feels_like * 9) / 5 + 32
      : data.main.feels_like;

  document.getElementById("feelsLike").textContent = `${Math.round(
    feelsLike
  )}°${state.settings.unit === "fahrenheit" ? "F" : "C"}`;
  document.getElementById("uvIndex").textContent = "N/A";

  // Show card
  document.getElementById("weatherContainer").innerHTML = "";
  card.style.display = "block";

  // Check if already in favorites
  const isFavorite = state.favorites.some((fav) => fav.name === data.name);
  const btn = document.querySelector(".favorite-btn");
  if (isFavorite) {
    btn.style.background = "var(--warning-color)";
    btn.innerHTML = '<i class="fas fa-heart"></i> Remove from Favorites';
  } else {
    btn.style.background = "var(--success-color)";
    btn.innerHTML = '<i class="fas fa-heart"></i> Add to Favorites';
  }
}

// Load Forecast
async function loadForecast() {
  if (!state.currentCity) return;

  try {
    const response = await fetch(`/api/forecast/${state.currentCity}`);
    if (!response.ok) throw new Error("Forecast not available");

    const data = await response.json();
    displayForecast(data);
  } catch (error) {
    showError("Could not load forecast");
  }
}

// Display Forecast
function displayForecast(data) {
  const container = document.getElementById("forecastContainer");
  document.getElementById(
    "forecastCity"
  ).textContent = `${data.city.name}, ${data.city.country}`;

  const forecasts = {};
  data.list.forEach((item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!forecasts[date]) {
      forecasts[date] = item;
    }
  });

  container.innerHTML = "";
  Object.values(forecasts)
    .slice(0, 5)
    .forEach((forecast) => {
      const temp =
        state.settings.unit === "fahrenheit"
          ? (forecast.main.temp * 9) / 5 + 32
          : forecast.main.temp;

      const card = document.createElement("div");
      card.className = "forecast-card";
      card.innerHTML = `
            <div class="forecast-date">
                ${new Date(forecast.dt * 1000).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
            </div>
            <img src="<https://openweathermap.org/img/wn/${
              forecast.weather > [0].icon
            }@2x.png" 
                 class="forecast-icon" alt="weather">
            <div class="forecast-temp">
                ${Math.round(temp)}°${
        state.settings.unit === "fahrenheit" ? "F" : "C"
      }
            </div>
            <div class="forecast-condition">
                ${forecast.weather[0].description}
            </div>
            <div class="forecast-condition" style="margin-top: 0.5rem;">
                💧 ${forecast.main.humidity}% | 💨 ${forecast.wind.speed} m/s
            </div>
        `;
      container.appendChild(card);
    });
}

// Add to Favorites
function addToFavorites() {
  if (!state.currentWeather) return;

  const isFavorite = state.favorites.some(
    (fav) => fav.name === state.currentWeather.name
  );

  if (isFavorite) {
    state.favorites = state.favorites.filter(
      (fav) => fav.name !== state.currentWeather.name
    );
  } else {
    state.favorites.push({
      name: state.currentWeather.name,
      country: state.currentWeather.sys.country,
    });
  }

  localStorage.setItem("favorites", JSON.stringify(state.favorites));
  displayWeather(state.currentWeather);
}

// Display Favorites
function displayFavorites() {
  const container = document.getElementById("favoritesContainer");

  if (state.favorites.length === 0) {
    container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-star"></i>
                <p>No favorite cities yet</p>
            </div>
        `;
    return;
  }

  container.innerHTML = "";
  state.favorites.forEach((city) => {
    const card = document.createElement("div");
    card.className = "favorite-card";
    card.innerHTML = `
            <button class="remove-favorite" onclick="removeFavorite('${city.name}')">
                <i class="fas fa-times"></i>
            </button>
            <h3>${city.name}</h3>
            <p>${city.country}</p>
        `;
    card.addEventListener("click", () => {
      if (event.target.closest(".remove-favorite")) return;
      fetchWeather(city.name);
      showPage("home");
    });
    container.appendChild(card);
  });
}

// Remove Favorite
function removeFavorite(cityName) {
  state.favorites = state.favorites.filter((fav) => fav.name !== cityName);
  localStorage.setItem("favorites", JSON.stringify(state.favorites));
  displayFavorites();
}

// Settings
function updateSettings() {
  state.settings.unit = document.getElementById("tempUnit").value;
  state.settings.theme = document.getElementById("theme").value;
  state.settings.notifications =
    document.getElementById("notifications").checked;

  localStorage.setItem("settings", JSON.stringify(state.settings));
  applySettings();

  if (state.currentWeather) displayWeather(state.currentWeather);
}

function applySettings() {
  document.getElementById("tempUnit").value = state.settings.unit;
  document.getElementById("theme").value = state.settings.theme;
  document.getElementById("notifications").checked =
    state.settings.notifications;

  if (
    state.settings.theme === "dark" ||
    (state.settings.theme === "auto" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
}

function clearAllData() {
  if (confirm("Are you sure? This will clear all favorites and settings.")) {
    localStorage.clear();
    state.favorites = [];
    state.settings = {
      unit: "celsius",
      theme: "light",
      notifications: false,
    };
    location.reload();
  }
}

// Utilities
function showLoading() {
  document.getElementById("weatherContainer").innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading weather data...</p>
        </div>
    `;
  document.getElementById("currentWeather").style.display = "none";
}

function showError(message) {
  document.getElementById("errorMessage").textContent = message;
  document.getElementById("errorModal").style.display = "block";
}

function closeError() {
  document.getElementById("errorModal").style.display = "none";
}

window.addEventListener("click", (event) => {
  const modal = document.getElementById("errorModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

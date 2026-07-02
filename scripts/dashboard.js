import { getWeatherTheme } from './auth-utils.js';

const greeting = document.getElementById('greeting');
const weatherForm = document.getElementById('weatherForm');
const cityInput = document.getElementById('cityInput');
const currentWeather = document.getElementById('currentWeather');
const forecastList = document.getElementById('forecastList');
const errorMessage = document.getElementById('errorMessage');
const app = document.getElementById('app');

const savedUser = JSON.parse(localStorage.getItem('weatherUser') || 'null');
if (savedUser) {
  greeting.textContent = `Hello, ${savedUser.name}`;
}

const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

function setStatus(message, isError = false) {
  errorMessage.textContent = message;
  errorMessage.style.color = isError ? '#ffb1b1' : '#a8b7c8';
}

function getWeatherDescription(code) {
  const descriptions = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    95: 'Thunderstorm',
    96: 'Thunderstorm with hail',
    99: 'Heavy thunderstorm with hail'
  };

  return descriptions[code] || 'Mixed conditions';
}

function renderCurrentWeather(locationName, data) {
  currentWeather.innerHTML = `
    <div class="weather-card">
      <h2>${locationName}</h2>
      <p>${getWeatherDescription(data.current.weather_code)}</p>
      <p><strong>${data.current.temperature_2m}°C</strong></p>
      <p>Feels like ${data.current.apparent_temperature}°C</p>
      <p>Humidity: ${data.current.relative_humidity_2m}%</p>
      <p>Wind: ${data.current.wind_speed_10m} km/h</p>
    </div>
  `;
}

function renderForecast(data) {
  const days = data.daily.time.slice(0, 3);
  forecastList.innerHTML = days
    .map((date, index) => `
      <div class="forecast-item">
        <div>
          <strong>${new Date(date).toLocaleDateString('en', { weekday: 'short' })}</strong>
          <p>${getWeatherDescription(data.daily.weather_code[index])}</p>
        </div>
        <div>
          <p>High: ${data.daily.temperature_2m_max[index]}°C</p>
          <p>Low: ${data.daily.temperature_2m_min[index]}°C</p>
        </div>
      </div>
    `)
    .join('');
}

function updateTheme(code, temperature) {
  const themeClass = getWeatherTheme(code, temperature);
  app.className = `dashboard-shell ${themeClass}`;
}

async function fetchWeather(city) {
  setStatus('Loading weather…');

  const geoResponse = await fetch(`${GEO_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
  if (!geoResponse.ok) {
    throw new Error('Could not find that city. Please try another one.');
  }

  const geoData = await geoResponse.json();
  if (!geoData.results?.length) {
    throw new Error('Could not find that city. Please try another one.');
  }

  const location = geoData.results[0];
  const forecastResponse = await fetch(`${FORECAST_URL}?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);

  if (!forecastResponse.ok) {
    throw new Error('Weather data is temporarily unavailable.');
  }

  const data = await forecastResponse.json();
  const locationLabel = `${location.name}${location.admin1 ? `, ${location.admin1}` : ''}, ${location.country}`;

  renderCurrentWeather(locationLabel, data);
  renderForecast(data);
  updateTheme(data.current.weather_code, data.current.temperature_2m);
  setStatus(`Showing forecast for ${locationLabel}.`);
}

weatherForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();

  if (!city) {
    setStatus('Please enter a city.', true);
    return;
  }

  try {
    await fetchWeather(city);
  } catch (error) {
    currentWeather.innerHTML = '<p>Unable to load weather right now.</p>';
    forecastList.innerHTML = '';
    setStatus(error.message, true);
    console.error(error);
  }
});

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

const city = document.getElementById("city");
const temp = document.getElementById("temp");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const icon = document.getElementById("icon");
const forecast = document.getElementById("forecast");
const weatherCard = document.getElementById("weatherCard");

weatherCard.style.display = "none";

// WeatherAPI key
const apiKey = "468c28a2b2bd40e4a6f182202260207";

searchBtn.addEventListener("click", function () {
    getWeather(cityInput.value);
});

cityInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        getWeather(cityInput.value);
    }
});

async function getWeather(cityName) {
    if (!cityName.trim()) {
        alert("Please enter a city.");
        return;
    }

    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityName}&days=3`;

    try {
        document.getElementById("loading").textContent = "Loading...";
        const response = await fetch(url);
        const data = await response.json();

        document.getElementById("loading").textContent = "";

        if (data.error) {
            alert("City not found.");
            return;
        }

        displayWeather(data);
    } catch (error) {
        document.getElementById("loading").textContent = "";
        alert("Unable to fetch weather.");
    }
}

function displayWeather(data) {
    document.getElementById("weatherCard").style.display = "block";
    city.textContent = data.location.name;
    temp.textContent = data.current.temp_c + "°C";
    condition.textContent = data.current.condition.text;
    humidity.textContent = data.current.humidity;
    wind.textContent = data.current.wind_kph;
    icon.src = "https:" + data.current.condition.icon;
    showForecast(data.forecast.forecastday);
    changeBackground(data.current.condition.text);
    forecast.style.display = "flex";
}

function showForecast(days) {
    forecast.innerHTML = "";
    days.forEach(function (day) {
        forecast.innerHTML += `
        <div class="forecast-card">
            <h3>${new Date(day.date).toLocaleDateString("en-US", {weekday: "short"})}</h3>
            <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">
            <p>${day.day.avgtemp_c}°C</p>
            <p>${day.day.condition.text}</p>
        </div>
        `;
    });
}

function changeBackground(weather) {
    if (weather.includes("Sunny") || weather.includes("Clear")) {
        document.body.style.background =
            "linear-gradient(135deg,#f6d365,#fda085)";
    } else if (weather.includes("Rain")) {
        document.body.style.background =
            "linear-gradient(135deg,#4b79a1,#283e51)";
    } else if (weather.includes("Cloud")) {
        document.body.style.background =
            "linear-gradient(135deg,#757F9A,#D7DDE8)";
    } else if (weather.includes("Snow")) {
        document.body.style.background =
            "linear-gradient(135deg,#83a4d4,#b6fbff)";
    }
}

getWeather("Delhi");

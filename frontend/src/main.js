// DOM Elements
const weatherContainer = document.getElementById('weather-container');
const farmTips = document.getElementById('farm-tips');

// Farm-specific messages
const farmMessages = {
    Clear: "Perfect weather for farm activities!",
    Clouds: "Great lighting for photography today",
    Rain: "Ideal day for cozy lodge relaxation",
    Thunderstorm: "Dramatic skies over the pastures",
    Snow: "Winter wonderland at the farm"
};

// Fetch weather data
async function fetchWeather() {
    try {
        const response = await fetch('http://localhost:5267/api/weather');  // ← Changed port
        if (!response.ok) throw new Error("API response error");
        const data = await response.json();
        console.log("Received data:", data);  // ← Add this for debugging
        updateDisplay(data);
    } catch (error) {
        console.error("Fetch error:", error);
        weatherContainer.innerHTML = `
            <div class="error">
                <p>Weather data unavailable</p>
                <p>Error: ${error.message}</p>
                <p>Backend is running on port 5267</p>
            </div>
        `;
    }
}

// Update UI with weather data
function updateDisplay(data) {
    const weather = data.weather[0];
    const main = data.main;
    
    weatherContainer.innerHTML = `
        <div class="current-weather">
            <div class="weather-main">
                <img src="https://openweathermap.org/img/wn/${weather.icon}@4x.png" 
                     alt="${weather.description}" class="weather-icon">
                <div class="temp">${Math.round(main.temp)}°C</div>
            </div>
            <div class="details">
                <p>${weather.description}</p>
                <p>Humidity: ${main.humidity}%</p>
                <p>Wind: ${Math.round(data.wind.speed * 2.237)} mph</p>
            </div>
        </div>
    `;
    
    farmTips.innerHTML = `
        <h3>Farm Tip</h3>
        <p>${farmMessages[weather.main] || "Enjoy the beautiful countryside!"}</p>
    `;
}

// Initial load
fetchWeather();
// Refresh every 30 minutes
setInterval(fetchWeather, 1800000);
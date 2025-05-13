// DOM Elements
const weatherContainer = document.getElementById('weather-container');
const farmTips = document.getElementById('farm-tips');
const updateTimeElement = document.getElementById('update-time');

// Farm Activity Database
const farmActivities = {
    Clear: {
        day: {
            message: "Beautiful day at Brakehill Barns!",
            activities: [
                "Relax at the glamping site or head to the beach",
                "Explore the venue grounds and wildflower meadows",
                "Enjoy countryside walks or a visit to a nearby village pub"
            ],
            icon: "🌞"
        },
        night: {
            message: "Starry night at Brakehill Barns!",
            activities: [
                "Stargazing with minimal light pollution",
                "Evening campfire and marshmallows",
                "Night-time photography around the barns"
            ],
            icon: "🌙"
        }
    },
    Clouds: {
        day: {
            message: "Soft light perfect for creativity",
            activities: [
                "Photography around the barns and fields",
                "Pottery or willow weaving workshops",
                "Gentle walks and nature sketching"
            ],
            icon: "⛅"
        },
        night: {
            message: "Cloudy skies tonight",
            activities: [
                "Indoor craft sessions in the barn",
                "Board games in your lodge or bell tent",
                "Evening planning for weddings and events"
            ],
            icon: "☁️"
        }
    },
    Rain: {
        day: {
            message: "Cozy rainy day at Brakehill Barns",
            activities: [
                "Warm up with indoor pottery or weaving",
                "Bake bread or scones in the farmhouse kitchen",
                "Enjoy tea and books in the communal space"
            ],
            icon: "🌧️"
        },
        night: {
            message: "Peaceful rainy evening",
            activities: [
                "Candlelit storytelling or reading in your tent",
                "Listen to the rain from your glamping pod",
                "Hot drinks and board games with friends or family"
            ],
            icon: "🌧️🌙"
        }
    }
};


// Fetch weather data
async function fetchWeather() {
    try {
        showLoadingState();
        const response = await fetch('http://localhost:5267/api/weather');
        
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        
        const data = await response.json();
        updateDisplay(data);
        updateTimestamp(data);
        
    } catch (error) {
        showErrorState(error);
    }
}

// Update UI with weather data
function updateDisplay(data) {
    const weather = data.weather[0];
    const main = data.main;
    const isDay = isDaytime(data);
    const conditions = farmActivities[weather.main] || getDefaultConditions();
    const current = isDay ? conditions.day : conditions.night;
    const windSpeed = (data.wind.speed * 2.237).toFixed(1); // m/s to mph

    // Update time theme
    document.body.classList.toggle('night-mode', !isDay);

    weatherContainer.innerHTML = `
        <div class="weather-grid">
            <div class="weather-primary">
                <div class="temp-icon">
                    <span class="condition-icon">${current.icon}</span>
                    <span class="temperature">${Math.round(main.temp)}°C</span>
                </div>
                <img src="https://openweathermap.org/img/wn/${weather.icon}@4x.png" 
                     alt="${weather.description}" 
                     class="weather-image">
            </div>
            
            <div class="weather-details">
                <div class="detail-card">
                    <span class="detail-label">Feels Like</span>
                    <span class="detail-value">${Math.round(main.feels_like)}°C</span>
                </div>
                <div class="detail-card">
                    <span class="detail-label">Humidity</span>
                    <span class="detail-value">${main.humidity}%</span>
                </div>
                <div class="detail-card">
                    <span class="detail-label">Wind</span>
                    <span class="detail-value">${windSpeed} mph</span>
                </div>
            </div>
        </div>
    `;
    
    farmTips.innerHTML = `
        <div class="activities-card">
            <h3><span class="activity-icon">${current.icon}</span> ${isDay ? 'Today' : 'Tonight'} at the Farm</h3>
            <p class="activity-message">${current.message}</p>
            <ul class="activity-list">
                ${current.activities.map(activity => `<li>${activity}</li>`).join('')}
            </ul>
        </div>
    `;
}

// Helper functions
function isDaytime(data) {
    // Check icon code first (d=day, n=night)
    if (data.weather[0].icon.endsWith('d')) return true;
    if (data.weather[0].icon.endsWith('n')) return false;
    
    // Fallback to sunrise/sunset times
    const now = Date.now() / 1000; // Current UTC timestamp
    return now > data.sys.sunrise && now < data.sys.sunset;
}

function updateTimestamp(data) {
    const localTime = convertToLocalTime(data.dt, data.timezone);
    updateTimeElement.textContent = formatLocalTime(localTime);
}

function convertToLocalTime(utcTimestamp, timezoneOffsetSeconds) {
    return new Date((utcTimestamp + timezoneOffsetSeconds) * 1000);
}

function formatLocalTime(date) {
    return date.toLocaleString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        day: 'numeric',
        month: 'short'
    });
}

function getDefaultConditions() {
    return {
        day: {
            message: "Enjoy your day at Brake Hill!",
            activities: ["Relax and enjoy the countryside"],
            icon: "🌿"
        },
        night: {
            message: "Peaceful evening at Brake Hill",
            activities: ["Stargaze from your lodge"],
            icon: "✨"
        }
    };
}

function showLoadingState() {
    weatherContainer.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Fetching farm conditions...</p>
        </div>
    `;
}

function showErrorState(error) {
    weatherContainer.innerHTML = `
        <div class="error-state">
            <span class="error-icon">⚠️</span>
            <h3>Weather Update Unavailable</h3>
            <p>We can't fetch the latest conditions right now.</p>
            <p class="error-detail">${error.message}</p>
            <button onclick="fetchWeather()" class="retry-btn">Try Again</button>
        </div>
    `;
}

// Initialize
fetchWeather();
setInterval(fetchWeather, 1800000); // Refresh every 30 minutes
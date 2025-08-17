const apiKey = "jzzsRG1waoRhya1XhkCHENgbXO1zAdg9";

var cityInput = document.getElementById("city-input");
var searchBtn = document.getElementById("search-btn");
var unitToggle = document.getElementById("unit-toggle");
var cityName = document.getElementById("city-name");
var dateTime = document.getElementById("date-time");
var weatherIcon = document.getElementById("weather-icon");
var temp = document.getElementById("temp");
var description = document.getElementById("description");
var feelsLike = document.getElementById("feels-like");
var humidity = document.getElementById("humidity");
var wind = document.getElementById("wind");
var forecast = document.getElementById("forecast");
var unit = "metric"; // Default unit

async function getWeather(city) {
    try {
        // Get location data
        const locationRes = await fetch(
            `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`
        );
        const locationData = await locationRes.json();
        
        if (!locationData[0]) {
            alert("City not found");
            return;
        }
        
        const locationKey = locationData[0].Key;

        // Get current weather
        const currentRes = await fetch(
            `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}&details=true`
        );
        const currentData = await currentRes.json();

        // Get forecast
        const forecastRes = await fetch(
            `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}&metric=true`
        );
        const forecastData = await forecastRes.json();

        // Return all data for UI handling
        return { currentData, forecastData, locationData };

    } catch (error) {
        alert("Error fetching weather data");
        console.error(error);
    }
}

function handleSearchClick() {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
    } else {
        alert("Please enter a city name");
    }
}

searchBtn.addEventListener("click", handleSearchClick);

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

async function handleSearchClick() {
    const city = cityInput.value.trim();
    if(city){
        try {
            const data = await getWeather(city); // <-- need await here
            if (data) {
                const { currentData, forecastData, locationData } = data;
                updateUI(currentData, forecastData, locationData); 
            }
        } catch (err) {
            console.error(err);
            alert("Failed to fetch weather");
        }
    } else {
        alert("no value");
    }
}

searchBtn.addEventListener("click", handleSearchClick);


//update UI with weather data
function updateUI(currentData, forecastData, locationData) {
    const current = currentData[0];
    const location = locationData[0];
    
    cityName.textContent = location.LocalizedName;
    dateTime.textContent = new Date(current.LocalObservationDateTime).toLocaleString();
    weatherIcon.src = `https://developer.accuweather.com/sites/default/files/${current.WeatherIcon.toString().padStart(2, '0')}-s.png`;
    
    temp.innerText = current.Temperature.Metric.value;
    description.innerText = current.WeatherText;
    feelsLike.innerText = current.RealFeelTemperature.Metric.Value
    humidity.innerText = current.RelativeHumidity + "%";
    wind.innerText = current.Wind.Speed.Metric.Value + " " + current.Wind.Speed.Metric.Unit;
    unit = current.Temperature.Metric.Unit;
  
// Clear previous forecast
forecast.innerHTML = "";

// Check if forecast data exists
if (forecastData && forecastData.DailyForecasts) {
    forecastData.DailyForecasts.forEach(day => {
        const date = new Date(day.Date).toLocaleDateString();
        const iconNum = day.Day.Icon.toString().padStart(2, '0');
        const iconUrl = `https://www.accuweather.com/images/weathericons/${iconNum}.svg`;
        const minTemp = day.Temperature.Minimum.Value;
        const maxTemp = day.Temperature.Maximum.Value;
        const unit = day.Temperature.Minimum.Unit;
        const desc = day.Day.IconPhrase;

        // Create forecast card
        const card = document.createElement("div");
        card.className = "forecast-card";
        card.innerHTML = `
            <div>${date}</div>
            <img src="${iconUrl}" alt="${desc}" />
            <div>${desc}</div>
            <div>Min: ${minTemp}°${unit} / Max: ${maxTemp}°${unit}</div>
        `;
        forecast.appendChild(card);
    });
}

}
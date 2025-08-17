require("dotenv").config();

const apiKey = process.env.ACCUWEATHER_API_KEY;

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

searchBtn.addEventListener("click", () => {  
    const value = cityInput.value;
     localStorage.setItem('city', value);
     console.log(`City saved: ${value}`);
    });
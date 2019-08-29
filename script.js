// Create app namespace to hold all methods
const weatherApp = {};

weatherApp.baseUrl = `http://api.apixu.com/v1//forecast.json`;
weatherApp.apiKey;

// Setup autocompleter and collect user input
weatherApp.setupAutocomplete = function () {

}

// Make AJAX request 
weatherApp.getForecast = function(location) {
    $.ajax({
        url: weatherApp.baseUrl,
        method: 'GET',
        datatype: 'json',
        data: {
            key: weatherApp.apiKey,
            format: 'json',
            q: location
        }
    })

    let forecastData;
    // Ajax call to get and store the forecast data

    weatherApp.displayWeather(forecastData);
}

// Display forecast on the page
weatherApp.displayWeather = function (forecast) {
    forecast.forEach(function (day) {
        weatherApp.weatherDayView(day);
    });
    // dynamically append forecast to render on the page
}

// Display weather of the day 
weatherApp.weatherDayView = function () {
    // view day summary
}

// detailed day forecast
weatherApp.detailedView = function () {
}

// Start app
weatherApp.init = function () {
    this.setupAutocomplete();
}

// Document ready
$(function () {
    weatherApp.init();
});
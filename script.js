
const weatherApp = {};

weatherApp.baseUrl = `http://api.apixu.com/v1/forecast.json`;
weatherApp.apiKey = `54437cb447384a0289e193947192808`;


weatherApp.formComplete = function () {

    $("#jsElemCity").autocomplete({
        source: function (request, response) {
            $.getJSON(
                "http://gd.geobytes.com/AutoCompleteCity?callback=?&q=" + request.term,
                function (data) {
                    response(data);
                }
            );
        },
        minLength: 3,
        delay: 300,
        select: function (event, ui) {
            weatherApp.getWeather(ui.item.value);
        },

        open: function () {
            $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
        },

        close: function () {
            $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
        }
    });
}

weatherApp.getWeather = function (location) {
    $.ajax({
        url: weatherApp.baseUrl,
        method: 'GET',
        dataType: 'json',
        data: {
            key: weatherApp.apiKey,
            format: 'json',
            q: location,
            days: 5
        }
    }).then(function (result) {
        console.log("results", result);
        weatherApp.forecastData = result.forecast.forecastday;
        weatherApp.displayWeather(weatherApp.forecastData, result.location);
    })
}

// Display forecast on the page
weatherApp.displayWeather = function (forecast, location) {
    $('.searchBlock').addClass('smallSearch');
    $('#jsCityName').html(`${location.name}, ${location.region}`);
    $('#jsWeekContainer').empty();
    forecast.forEach(function (day, index) {
        weatherApp.weatherDayView(day, index);
    });
}

// Display weather of the day for the week
weatherApp.weatherDayView = function (item, index) {
    $('#jsWeekContainer').append(`
        <div class="dayContainer" data-index="${index}">
            <p>${item.date}</p>
            <img src="${item.day.condition.icon}" alt="${item.day.condition.text}">
            <p>${item.day.mintemp_c}C</p>
            <p>${item.day.maxtemp_c}C</p>
        </div>  
    `);
}

$('#jsWeekContainer').on('click', '.dayContainer', function() {
    // Find the index of the day 
    const dayIndex = $(this).data('index');
    // weather info for the array clicked
    const data = weatherApp.forecastData[dayIndex];

    $('#jsDetailedView').empty();
    $('#jsDetailedView').append(`
        <div>
            <p>Avg. Temp ${data.day.avgtemp_c}</p>
            <p>Min Temp ${data.day.mintemp_c}</p>
            <p>Max Temp ${data.day.maxtemp_c}</p>
        </div>
        <div>
            <p>${data.date}</p>
            <img src="${data.day.condition.icon}" alt="${data.day.condition.text}">
            <p>${data.day.condition.text}</p>
            <p>Sunrise: ${data.astro.sunrise}</p>
            <p>Sunset: ${data.astro.sunset}</p>
        </div>
        <div>
            <p>Humidity: ${data.day.avghumidity}%</p>
            <p>Wind: ${data.day.maxwind_kph} km/h</p>
            <p>UV: ${data.day.uv} km/h</p>
        </div> 
    `);    
});

weatherApp.init = function () {
    weatherApp.formComplete();
};

$('document').ready(function () {
    weatherApp.init();
});



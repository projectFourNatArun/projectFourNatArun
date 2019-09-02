// App namespace to hold all methods
const weatherApp = {};

weatherApp.baseUrl = `http://api.apixu.com/v1/forecast.json`;
weatherApp.apiKey = `54437cb447384a0289e193947192808`;

// Function for autocomplete
weatherApp.formComplete = function () {
    // Credit http://geobytes.com/free-ajax-cities-jsonp-api/
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
    });
}

// Ajax request with user input
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
        weatherApp.forecastData = result.forecast.forecastday;
        weatherApp.displayWeather(weatherApp.forecastData, result.location);
    }).fail(function (err) {
        console.log(err);
        $('#jsError').removeClass('hidden');
        $('#jsError').text(`${err.responseJSON.error.message}`);
    });
}

// Format date
weatherApp.formatDate = function(date) {
    const options = {month: 'short', day: 'numeric', weekday: 'short', timeZone: 'UTC'};
    const newDate = new Date(date);

    return newDate.toLocaleDateString("en-US", options);
}

// Display forecast on the page
weatherApp.displayWeather = function (forecast, location) {
    $('#jsCityName').html(`${location.name}, ${location.region}`);
    $('input').val('');
    $('#jsWeekContainer').empty();
    $('#jsDetailedView').empty();
    $('.mainScreen').addClass('flexHeader');
    $('#jsWeek').removeClass('hidden');
    forecast.forEach(function (day, index) {
        weatherApp.weatherDayView(day, index);
    });
    weatherApp.displayDayDetail(forecast[0]);
}

// Display weather of the day for the week
weatherApp.weatherDayView = function (item, index) {
    $('#jsWeekContainer').append(`
        <button class="dayContainer" data-index="${index}">
            <p>${weatherApp.formatDate(item.date)}</p>
            <div class=dayContent>
                <img src="${item.day.condition.icon}" alt="${item.day.condition.text}">
                <p><span class="value">${Math.round(item.day.maxtemp_c)} &#176;</span> <span class="minTemp">${Math.round(item.day.mintemp_c)} &#176;</span></p>
            </div>
        </button>  
    `);
}

// Display weather of the day 
weatherApp.displayDayDetail = function (data) {
    $('#jsDetailedView').empty();
    $('#jsDetailedView').append(`
        <div class="dayBlock dayBlockOne">
            <p class="averageTemp">${Math.round(data.day.avgtemp_c)} <span class="avg">&#176;C</span></p>
            <p>Max ${Math.round(data.day.maxtemp_c)} &#176; Min ${Math.round(data.day.mintemp_c)} &#176;</p> 
            <p>Sunrise <span class="value">${data.astro.sunrise}</span></p>
            <p>Sunset <span class="value">${data.astro.sunset}</span></p>
        </div>
        <div class="dayBlock dayBlockTwo">
            <p class="date">${weatherApp.formatDate(data.date)}</p>
            <div class="dayIcon">
                <img src="${data.day.condition.icon}" alt="${data.day.condition.text}">
            </div>
            <p>${data.day.condition.text}</p>
        </div>
        <div class="dayBlock dayBlockThree">
            <p>Humidity <span class="value">${data.day.avghumidity}%</span></p>
            <p>Wind <span class="value">${data.day.maxwind_kph} km/h</span></p>
            <p>UV <span class="value">${data.day.uv}</span></p>
            <p>Rain <span class="value">${data.day.totalprecip_mm} mm</span></p>
            <p>Visibility <span class="value">${data.day.avgvis_km} km</span></p>
        </div> 
    `);    
}

// Event listener for when user clicks on the desired day to view more details
$('#jsWeekContainer').on('click', '.dayContainer', function() {
    // Find the index of the day 
    const dayIndex = $(this).data('index');
    // weather info for the array clicked
    const data = weatherApp.forecastData[dayIndex];
    weatherApp.displayDayDetail(data);
});

weatherApp.init = function () {
    weatherApp.formComplete();
};

$('document').ready(function () {
    weatherApp.init();
});



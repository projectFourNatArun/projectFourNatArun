
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
        weatherApp.displayWeather(result.forecast.forecastday, result.location);
    })
}

// Display forecast on the page
weatherApp.displayWeather = function (forecast, location) {
    $('.searchBlock').addClass('smallSearch');
    $('#jsCityName').html(`${location.name}, ${location.region}`);
    forecast.forEach(function (day) {
        weatherApp.weatherDayView(day);
    });
}

// Display weather of the day 
weatherApp.weatherDayView = function (item) {
    $('#jsWeekContainer').append(`
        <div>
            <p>${item.date}</p>
            <img src="${item.day.condition.icon}" alt="${item.day.condition.text}">
            <p>${item.day.mintemp_c}C</p>
            <p>${item.day.maxtemp_c}C</p>
        </div>  
    `);
    // view day summary
}



weatherApp.init = function () {
    weatherApp.formComplete();
};

$('document').ready(function () {
    weatherApp.init();
});



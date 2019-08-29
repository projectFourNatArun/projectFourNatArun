
const weatherApp = {};

weatherApp.baseUrl = `http://api.apixu.com/v1/forecast.json`;
weatherApp.apiKey =`54437cb447384a0289e193947192808`;


weatherApp.formComplete = function(){

    $("#jsElemCity").autocomplete({
        source: function (request, response) {
        $.getJSON(
            "http://gd.geobytes.com/AutoCompleteCity?callback=?&q="+request.term,
            function (data) {
            response(data);
            }
        );
        },
        minLength: 3,
        select: function (event, ui) {
                var selectedObj = ui.item;
                $("#jsElemCity").val(selectedObj.value);
                return false;
            },

            open: function () {
                $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
            },

            close: function () {
                $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
            }
    });

    $("#jsElemCity").autocomplete("option", "delay", 100);


    
}

weatherApp.getWeather = function(location){

    $('form').on('submit', function(event){
        event.preventDefault();

        const location = $('input').val();
        const result = [];

        console.log(location);

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
        }).then(function(result){
            const res = result;
            console.log("results", res);
            // weatherApp.displayWeather(results);
        })
        
    });

}


weatherApp.init = function(){
    weatherApp.formComplete();
    weatherApp.getWeather(Location);
    
};

$('document').ready(function(){
    weatherApp.init();
}); 



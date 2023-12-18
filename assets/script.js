// TODO
// 1. When user search for a city in the input, call weather API and show the result in the HTML
//    - Add event listener to form submit
//    - Get the user input value
//    - Build the API query URL based on the user input value
//    - Call the API and render the result in the HTML
//        - Get the city name and show it in the main weather forecast card
//        - Get the first weather forecast item and get the following values
//            - date
//            - temperature
//            - wind speed
//            - humidity
//            - icon
//        - render those values to the main card
//        - Loop through all weathers array and get the following values
//            - date
//            - temperature
//            - wind speed
//            - humidity
//            - icon
//        - render those values to the smaller card
// 2. When user search for a city, store it in local storage
// 3. On initial page load load the search history and show it as a list in the HTML
//    - ....
//    - Build the API query URL based on the history stored in local storage
//    - Call the API and render the result in the HTML
// 4. When user click on the search history, call weather API and show the result in the HTML
// 5. CSS




//event listener to form submit
let searchLogic = function(){
$('#search-form').on('submit', function(event){
event.preventDefault();
let cityName = $('#search-input').val();
//fetch to get coordinates from city name
fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=1a06838aa0ec5de32fa5b9b5de0234e2&units=metric')
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(function(data) {
        const cityLat = data.coord.lat;
        const cityLon = data.coord.lon;
        console.log("Latitude: " + cityLat + ", Longitude: " + cityLon);

        // new URL with coordinates
        const queryURLwithCoords = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + cityLat + '&lon=' + cityLon + '&appid=1a06838aa0ec5de32fa5b9b5de0234e2&units=metric';

        // Second fetch using the new URL
        return fetch(queryURLwithCoords);
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(function(forecastData) {
        console.log("Forecast Data:", forecastData);
        displayWeather(forecastData);
    })
    .catch(function(error) {
        console.error('There has been a problem with your fetch operation:', error);
    });
    
});
};
searchLogic()
let displayWeather = function(forecastData){
    let weatherIcon = forecastData.list[0].weather[0].icon;
    let nameDisplay = $('<h2>').text(forecastData.city.name);
    let iconDisplay = $('<img>').attr('src', 'https://openweathermap.org/img/w/' + weatherIcon + '.png');
    let dateAndTime = $('<h2>').text('The time is ' + forecastData.list[0].dt_txt);
    let tempDisplay = $('<h2>').text('The current temperature is ' + forecastData.list[0].main.temp);
    let humidityDisplay = $('<h2>').text('The current humidity is ' + forecastData.list[0].main.humidity);
    let windSpeedDisplay = $('<h2>').text('The current wind speed is ' + forecastData.list[0].wind.speed);

    let currentWeatherContainer = $('#today');
    currentWeatherContainer.append(nameDisplay, iconDisplay, dateAndTime, tempDisplay, humidityDisplay, windSpeedDisplay);
}



    
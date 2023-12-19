let cityName = $('#search-input').val().trim();
displaySearchHistory()

//fetch to get coordinates from city name
let fetchAndDisplay = function(cityName){
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
        addToSearchHistory(cityName);
    })
    .catch(function(error) {
        console.error('There has been a problem with your fetch operation:', error);
    });
    
};


//Search submit event handler and clear input
let searchSubmit = function() {
    $('#search-form').on('submit', function(event) {
        event.preventDefault();
        let cityName = $('#search-input').val().trim();
        fetchAndDisplay(cityName);
        $('#search-input').val("");
    });
};
// History button click and clear input
$('#history').on('click', '.history-item', function() {
    let cityName = $(this).text();
    console.log("History button clicked:", cityName); 
    fetchAndDisplay(cityName);
});



//Current weather display (main display)==> Edited to include 5 day forcast cards
let displayWeather = function(forecastData){
    let weatherIcon = forecastData.list[0].weather[0].icon;
    let nameDisplay = $('<h2>').text(forecastData.city.name);
    let iconDisplay = $('<img>').attr('src', 'https://openweathermap.org/img/w/' + weatherIcon + '.png')
    let dateAndTime = $('<h2>').text('Today\'s date: ' + dayjs().format('DD-MM-YYYY'));
    let tempDisplay = $('<h2>').text('The current temperature is: ' + forecastData.list[0].main.temp.toFixed(1) + ' \u00B0C');
    let humidityDisplay = $('<h2>').text('The current humidity is: ' + forecastData.list[0].main.humidity.toFixed(1));
    let windSpeedDisplay = $('<h2>').text('The current wind speed is: ' + forecastData.list[0].wind.speed.toFixed(1) +' mph');

    let currentWeatherContainer = $('#today');
    currentWeatherContainer.empty()
    currentWeatherContainer.append(nameDisplay, iconDisplay, dateAndTime, tempDisplay, humidityDisplay, windSpeedDisplay);

    let dailyForecasts = process5DayForecast(forecastData);
    let forecastContainer = $('#forecast'); 
    forecastContainer.empty();

    dailyForecasts.forEach(day => {
        let dayCard = createForecastCard(day); 
        forecastContainer.append(dayCard)
    })
}
//1 card per day for 5 day forecast logic
function process5DayForecast(forecastData) {
    let dailyForecasts = [];

    for (let i = 0; i < forecastData.list.length; i += 8) {
        dailyForecasts.push(forecastData.list[i]);
    }

    return dailyForecasts;
};

function createForecastCard(dayForecast) {
    let card = $('<div>').addClass('card bg-primary text-center col-lg-2 border-rounded').css({'margin':'auto'})
    let date = new Date(dayForecast.dt * 1000);
    let dateString = dayjs(date).format('dddd, MMM D'); 
    let dateElem = $('<p>').text(dateString).addClass('card-header');
    let temp = dayForecast.main.temp.toFixed(1);
    let tempElem = $('<p>').text(`Temp: ${temp} °C`).addClass('card-body')
    let humidity = dayForecast.main.humidity;
    let humidElem = $('<p>').text('Humidity: ' + humidity).addClass('card-title');
    let iconCode = dayForecast.weather[0].icon;
    let iconUrl = 'https://openweathermap.org/img/w/' + iconCode + '.png';
    let iconElem = $('<img>').addClass('card-img-top').attr('src', iconUrl).css({ 'width': '50px', 'height': '50px', 'margin': 'auto'});

    card.append(dateElem, iconElem, tempElem, humidElem);

    return card; 
}



//Add searches to history
function addToSearchHistory(cityName) {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!searchHistory.includes(cityName)) {
        searchHistory.push(cityName);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
    displaySearchHistory();
}


//display searched cities
function displaySearchHistory() {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    let historyContainer = $('#history');
    historyContainer.empty();

    if (searchHistory.length === 0) {
        historyContainer.append($('<p>').text('No cities searched'));
    } else {
        searchHistory.forEach(city => {
            let historyItem = $('<button>').text(city).addClass('history-item');
            historyContainer.append(historyItem);
        });
    }
}
;
//clear history button (originally from debugging)

    $('#clear-history').on('click', function() {
        localStorage.removeItem('searchHistory'); 
        displaySearchHistory(); 
    });
;

searchSubmit()





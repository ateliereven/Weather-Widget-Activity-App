"use strict";

const searchInput = document.getElementById('searchInput');
const forecastSearch = document.getElementById('forecastSearch');
const city = document.getElementById('city');
const temperature = document.getElementById('temperature');
const weatherIcon = document.getElementById('weatherIcon');
const tempRange = document.getElementById('tempRange');

const solo = document.getElementById('solo');
const team = document.getElementById('team');
const all = document.getElementById('all');

// getting weather forecast data from api:
const getForecast = (city) => {
    const url = `/api?q=${city}&units=metric`;
    // clearing data from previous search:
    clearData();
    // fetching weather data:
    fetch(url).then(response => {
        if (!response.ok) {
            response.json().then(errResData => {
                const error = new Error('Something went wrong');
                error.data = errResData;
                throw error;
            });
        } else {
            return response.json();
        }
    }).then(data => {
        //console.log(data);
        handleData(data);
    })
        .catch(error => {
            console.log(error);
            UIFailure();
        });

    // clearing the form input field:
    searchInput.value = null;
};

// event listenet for form submission
document.getElementById('searchButton').addEventListener('click', e => {
    e.preventDefault();
    if (searchInput.value === '') {
        alert ('Please enter a city')
    } else {
        getForecast(searchInput.value)
    };
});

// for displaying the search result data:
const handleData = (data) => {
    city.textContent = data.name;
    temperature.textContent = Math.round(data.main.temp).toString() + '℃  ,  ' + data.weather[0].description;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherIcon.classList.remove('hidden');
    tempRange.textContent = `Low: ${Math.round(data.main.temp_min)}℃ | High: ${Math.round(data.main.temp_max)}℃`;
    //displayActivities(data.main.temp, all);
}

// clearing data from previous search:
const clearData = () => {
    if (forecastSearch.lastChild.id === 'error') {
        forecastSearch.removeChild(forecastSearch.lastChild);
    };
    city.textContent = '';
    temperature.textContent = '';
    weatherIcon.src = '';
    weatherIcon.classList.add('hidden');
    tempRange.textContent = '';
}

// search error handling:
const UIFailure = () => {
    const errMessage = document.createElement('h4');
    errMessage.id = 'error';
    errMessage.className = 'red';
    forecastSearch.appendChild(errMessage);
    errMessage.textContent = "Weather information unavailable / city not found. Please try again.";
}


// lists of activities by temprature:
class ActivityList {
    constructor(solo = [], team = []) {
        this.solo = solo;
        this.team = team;
        this.all = [].concat(this.solo, this.team);
    }
}
// temp above 25 degrees:
const summerActivitiesSolo = ['swimming', 'rowing', 'surfing', 'snorkeling', 'bicycling', 'walking', 'horseback riding'];
let summerActivitiesTeam = ['beach volleyball', 'water polo', 'kayaking', 'golf'];
const summerActivities = new ActivityList(summerActivitiesSolo, summerActivitiesTeam);
// temp between 8-25 degrees:
const fairActivitiesSolo = ['hiking', 'rowing', 'bicycling', 'running', 'walking', 'horseback riding'];
const fairActivitiesTeam = ['soccer', 'baseball', 'football', 'basketball', 'tennis', 'golf', 'rock-climbing'];
const fairActivities = new ActivityList(fairActivitiesSolo, fairActivitiesTeam);
// temp below 8 degrees:
const winterActivitiesSolo = ['skiing', 'sledding', 'snowboarding', 'walking'];
const winterActivitiesTeam = ['ice skating', 'hockey', 'ice climbing'];
const winterActivities = new ActivityList(winterActivitiesSolo, winterActivitiesTeam);
//console.log(winterActivities, fairActivities, summerActivities);

// for displaying activity lists by temprature:
const displayActivities = (temperature, type) => {
    if (temperature > 25) {
        mapActivitiesToList(summerActivities[type]);
    };
    if (temperature >= 8 && temperature <= 25) {
        mapActivitiesToList(fairActivities[type]);
    };
    if (temperature < 8) {
        mapActivitiesToList(winterActivities[type]);
    };
}
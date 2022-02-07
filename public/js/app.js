"use strict";

const searchInput = $('#searchInput');
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
        // clearing the form input field:
        searchInput.val(null);
    })
        .catch(error => {
            console.log(error);
            UIFailure();
        });
};

// event listener for form submission
document.getElementById('searchButton').addEventListener('click', e => {
    e.preventDefault();
    if (searchInput.val() === '') {
        alert('Please enter a city')
    } else {
        getForecast(searchInput.val())
    };
});

// clearing data from previous search:
const clearData = () => {
    $('#error').remove();
    $('#warning').remove();
    $('#city, #temperature, #tempRange').text('');
    $('#weatherIcon').addClass('hidden').attr("src", "");
}

// search error handling:
const UIFailure = () => {
    const errMessage = $('<div id="error" class="red"></div>');
    errMessage.html("<h4>Weather information unavailable / city not found</h4> <h4 class='my-1'>Please try again</h4>");
    $('#forecastSearch').append(errMessage);
}

// for displaying the search result data:
const handleData = (data) => {
    $('#city').text(data.name);
    $('#temperature').text(Math.round(data.main.temp).toString() + '℃  ,  ' + data.weather[0].description);
    $('#weatherIcon').removeClass('hidden').attr("src", `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
    $('#tempRange').text(`Low: ${Math.round(data.main.temp_min)}℃ | High: ${Math.round(data.main.temp_max)}℃`);

    // displaying a list of activities by temperature (all activities is the default):
    displayActivities(data.main.temp, data.weather[0].id, 'all');

    // moving container according to temperature:
    slideContainer(data.main.temp);

    //displaying activities by the selected type:
    const onTypeSelect = (type) => {
        [...type.parentElement.children].forEach(sib => sib.classList.remove('chosen'));
        type.classList.add('chosen');
        displayActivities(data.main.temp, data.weather[0].id, type.id)
    }

    // event listener for displaying a list of solo activities by temperature:
    solo.addEventListener('click', () => {
        onTypeSelect(solo)
    });
    // event listener for displaying a list of team activities by temperature:
    team.addEventListener('click', () => {
        onTypeSelect(team)
    });
    // event listener for displaying a list of all activities by temperature:
    all.addEventListener('click', () => {
        onTypeSelect(all)
    });
}

// lists of activities by temprature:
class ActivityList {
    constructor(solo = [], team = []) {
        this.solo = solo;
        this.team = team;
        this.all = [].concat(this.solo, this.team);
    }
}
// temp above 24 degrees:
const summerActivitiesSolo = ['swimming', 'rowing', 'surfing', 'snorkeling', 'bicycling', 'walking', 'horseback riding'];
let summerActivitiesTeam = ['beach volleyball', 'water polo', 'kayaking', 'golf'];
const summerActivities = new ActivityList(summerActivitiesSolo, summerActivitiesTeam);
// temp between 7-24 degrees:
const fairActivitiesSolo = ['hiking', 'rowing', 'bicycling', 'running', 'walking', 'horseback riding'];
const fairActivitiesTeam = ['soccer', 'baseball', 'football', 'basketball', 'tennis', 'golf', 'rock-climbing'];
const fairActivities = new ActivityList(fairActivitiesSolo, fairActivitiesTeam);
// temp below 7 degrees:
const winterActivitiesSolo = ['skiing', 'sledding', 'snowboarding', 'walking'];
const winterActivitiesTeam = ['ice skating', 'hockey', 'ice climbing'];
const winterActivities = new ActivityList(winterActivitiesSolo, winterActivitiesTeam);

// for displaying activity lists by temprature:
const displayActivities = (temperature, conditionsId, type) => {
    //clear warning from previous clicks:
    $('#warning').remove();
    // for poor weather conditions:
    const conditionsIdArray = [212, 221, 232, 312, 313, 314, 321, 503, 504, 511, 521, 522, 531, 602, 616, 621, 622, 731, 762, 771, 781];
    if (conditionsIdArray.includes(conditionsId)) {
        $('.container').append("<h2 class='red my-1' id='warning' style='padding-top:7%'>Better stay indoors!</h2>");
        return;
    }
    // when weather conditions allow, display activities:
    if (temperature > 24) {
        mapActivitiesToList(summerActivities[type]);
    };
    if (temperature >= 7 && temperature <= 24) {
        mapActivitiesToList(fairActivities[type]);
    }; if (temperature < 7) {
        mapActivitiesToList(winterActivities[type]);
    };
}

// creating a list of activities:
const mapActivitiesToList = (activitiesArray) => {
    let listItems = "";
    activitiesArray.forEach(activity => {
        listItems += `<li class="p-1">${activity}</li>`;
    });
    document.getElementById('list').innerHTML = listItems;
}

//animation for container:
const slideContainer = (temperature) => {
    const container = $('.container');
    const bgImgLeft = $('.backgroundImgLeft');
    const bgImgRight = $('.backgroundImgRight');
    if (window.innerWidth >= 1100) {
        if (temperature > 24) {
            // container should be on the right side of the page:
            container.attr("style", "transform:translateX(25vw);");
        } else if (temperature < 8) {
            // container should be on the left side of the page:
            container.attr("style", "transform:translateX(-25vw);");
        } else {
            // container should be centered (initial position):
            container.attr("style", "transform:translateX(0);");
        }
    } else {
        //make sure the container is centered:
        container.attr("style", "left: calc(50vw - var(--width) / 2)");

        if (temperature > 24) {
            // background image should slide left:
            bgImgRight.attr("style", "width:100%");
            bgImgLeft.attr("style", "transform:translateX(-100vw);width:0%");
        } else if (temperature < 8) {
            // background image should slide right:
            bgImgRight.attr("style", "width:0%");
            bgImgLeft.attr("style", "width:100%");
            container.attr("style", "border-color:$secondary-color");
        }
        else {
            bgImgRight.attr("style", "width:100%");
            bgImgLeft.attr("style", "width:100%");
        }
    }
  
}


const inputField = document.querySelector(".inputField");
const searchIcon = document.querySelector(".searchIcon");
const inputArea = document.querySelector(".inputArea");
const weatherRightNow = document.querySelector(".weatherRightNow");
const weatherExtraDetails = document.querySelector(".weatherExtraDetails");
const weatherChecker = document.querySelector(".weatherChecker");
const errorSection = document.querySelector(".errorSection");

const weatherImage = document.querySelector(".weatherRightNow .weatherImage");
const temperatureObject = document.querySelector(".weatherRightNow .temperature");
const placeNameObject = document.querySelector(".weatherRightNow .placeName");
const humidityObject = document.querySelector(".weatherExtraDetails .box .dataBox .dataBoxContent #humidity");
const windSpeedObject = document.querySelector(".weatherExtraDetails .box .dataBox .dataBoxContent #windSpeed");
const loadScreen = document.querySelector(".loaderScreen");


const currentWeatherCheckerBg = getComputedStyle(weatherChecker).backgroundImage;
const currentInputField = getComputedStyle(inputField).backgroundColor;


weatherChecker.style.backgroundImage = 'none';
inputField.style.borderBottomRightRadius = '20px';
inputField.style.borderBottomLeftRadius = '20px';


weatherRightNow.remove();
weatherExtraDetails.remove();
errorSection.remove();
loadScreen.remove();
//  api handling

let placeName = "Invalid placename";
const APIKEY = 'a2e30d90d85904eed891864ea2dbb62c';
let longitude = -1000;
let latitude = 1000;

let temperature = -3600;
let humidity = -1000;
let windSpeed = -1000;
let weatherImg = "";
const knowledgeBase = {
    "Thunderstorm": "clouds",
    "Drizzle": "drizzle",
    "Rain": "rain",
    "Snow": "snow",
    "Atmosphere": "mist",
    "Clear": "clear",
    "Clouds": "clouds",
    "Smoke" : "clouds",
    "Haze" : "clouds",
    "dust" : "clouds",
    "Tornado": "clouds",
    "Mist" : "clouds",
    "Fog" : "clouds"
}
let apiCallForLocation = `http://api.openweathermap.org/geo/1.0/direct?q=${placeName}&limit=1&appid=${APIKEY}`;
let apiCallForWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIKEY}`;


function updateURL(long,lat){
    apiCallForWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${APIKEY}`;
}

function updateLocationURL(name){
    apiCallForLocation = `http://api.openweathermap.org/geo/1.0/direct?q=${placeName}&limit=1&appid=${APIKEY}`;
}

function addLoadScreen(){
    weatherChecker.style.backgroundImage='none';
    inputField.style.backgroundColor = currentInputField;
    inputField.style.borderBottomLeftRadius = "0px";
    inputField.style.borderBottomRightRadius = "0px";

    weatherRightNow.remove();
    weatherExtraDetails.remove();
    weatherChecker.appendChild(loadScreen);
}
function removeLoadScreen(){
    loadScreen.remove();
}

async function callURL(){
    try {

        const response = await fetch(apiCallForWeather);
        const jsonReply = await response.json();
        temperature = (jsonReply.main.temp - 273.15).toFixed(2);
        humidity = jsonReply.main.humidity.toFixed(0);
        windSpeed = (jsonReply.wind.speed * 3.6).toFixed(2);
    
        let val = knowledgeBase[(jsonReply.weather[0].main)];
        weatherImg = `<img src="images/${val}.png" alt="">`
        updateWeather();
        return 1;
    }
    catch(error) {
        updateError("Network Issue!");
        return 0;
    }
}

// 0 fail
// 1 ok
// 2 internet issue
async function apiHandling(){

    try{
        updateLocationURL(placeName);

        const response = await fetch(apiCallForLocation);
        if(!response.ok){
            return 2;
        }
    
        let jsonReplay = await response.json();
        jsonReplay = jsonReplay[0];
        longitude = jsonReplay.lon;
        latitude = jsonReplay.lat;
        placeName = jsonReplay.name;
        updateURL(longitude , latitude);
        
        const newResponse = await callURL();
        return 1;
        
    }
    catch(error){
        updateError('Incorrect placename');
        return 0;
    }

}


function updateError(errorMessage){
    removeLoadScreen();
    weatherChecker.style.backgroundImage='none';
    inputField.style.backgroundColor = currentInputField;
    inputField.style.borderBottomLeftRadius = "0px";
    inputField.style.borderBottomRightRadius = "0px";

    weatherRightNow.remove();
    weatherExtraDetails.remove();
    inputField.style.borderBottomRightRadius = '0px';
    inputField.style.borderBottomLeftRadius = '0px';
    errorSection.innerHTML = `Error : ${errorMessage}`;
    weatherChecker.appendChild(errorSection);
}

function updateWeather(){
    // first change the image
    removeLoadScreen();
    errorSection.remove();
    weatherChecker.style.backgroundImage = currentWeatherCheckerBg; 
    weatherImage.innerHTML = weatherImg;
    temperatureObject.innerHTML = `${temperature} &#176; c`;
    placeNameObject.innerHTML = `${placeName}`;
    humidityObject.innerHTML = `${humidity}%`;
    windSpeedObject.innerHTML = `${windSpeed} km/h`;

    weatherChecker.appendChild(weatherRightNow);
    weatherChecker.appendChild(weatherExtraDetails);
    
    inputField.style.backgroundColor = 'rgb(73,203,173, 0)';

}

const handleSearch = () => {
    addLoadScreen();
    errorSection.remove();
    placeName = inputArea.value;
    let size = placeName.length;
    let space = 0;
    for (let i = 0; i < size; i++) {
        if (placeName[i] === ' ') {
            space++;
        }
    }

    if (space != size) {
        // Now I have a name
        const result = (async () => {
            let decidingFactor = -1;

            try {
                decidingFactor = await apiHandling();
            } catch (error) {
                decidingFactor = error;
            }
        })();
    }
};


searchIcon.addEventListener("click", handleSearch);
inputArea.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        handleSearch();
    }
});

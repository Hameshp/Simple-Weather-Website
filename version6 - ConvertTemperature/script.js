const key = '616a15d05f535725598faafae8e5d127'; 	// Personal 'openweathermap' api key

const f = document.getElementById('form');
const q = document.getElementById('query');

let city = ['Auckland'];								// Stores city name query	|| 'Auckland' city is default
let units = 'metric';

// --------------------------------------------------------------------------------------------------------------------------------

// API Call For User Input
function weather( cityName ) {
	fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + key + '&units=' + units)
	.then(function(resp) { return resp.json() }) 	// Convert data to json
	.then(function(data) {
		drawWeather(data);
	})
	.catch(function() { 	// Catch any errors
	});
}

// API Call For Five Day Forcast
function forcast( cityName ) {
	fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=' + key + '&units=' + units) 
	.then(function(resp) { return resp.json() }) 	// Convert data to json
	.then(function(data) {
		drawForcast(data);
	})
	.catch(function() { 	// Catch any errors
	});
}

// API Call For Geolocation
function showPosition( position ) {
	var latCoord = position.coords.latitude;
	var lonCoord = position.coords.longitude;
	fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + latCoord + '&lon=' + lonCoord + '&appid=' + key + '&units=' + units)
	.then(function(resp) { return resp.json() }) 	// Convert data to json
	.then(function(data) {
		drawWeather(data);
		drawForcast(data);
	})
	.catch(function() { 	// Catch any errors
	});
}

// --------------------------------------------------------------------------------------------------------------------------------

// Current Weather
function drawWeather( data ) {

	// Weather Description
	var main_description = data.weather[0].main;
	var weather_description = data.weather[0].description;

	var description = capitalise( weather_description.split(" ") );

	// document.getElementById('main-description').innerHTML = capitalise( main_description.split(" ") );
	document.getElementById('main-description').innerHTML = weatherIcon( capitalise( main_description.split(" ") ),data.clouds.all );
	document.getElementById('description').innerHTML = description.join(" ");		// Joins the array with a *space*

	// Temperature
	var celcius = Math.round(data.main.temp);
	var min_temp = Math.round((data.main.temp_min) * 10) / 10;
	var max_temp = Math.round((data.main.temp_max) * 10) / 10;
	var feels = Math.round((data.main.feels_like) * 10) / 10;
	
	document.getElementById('temp').innerHTML = celcius + '&deg;';									// Current Temperature
	document.getElementById('min-temp').innerHTML = 'Min Temperature: ' + min_temp + '&deg;';		// Minimum Temperature
	document.getElementById('max-temp').innerHTML = 'Max Temperature: ' + max_temp + '&deg;';		// Maximum Temperature
	document.getElementById('feels-temp').innerHTML = 'Feels like ' + feels + '&deg;';				// Feels like Temperature

	document.getElementById('humid').innerHTML = 'Humidity: ' + data.main.humidity + '%';			// Humidity
	document.getElementById('cloudiness').innerHTML = 'Cloudiness: ' + data.clouds.all + '%';		// Cloudiness
	
	// Location
	city[0] = data.name;
	document.getElementById('city').innerHTML = data.name;											// City
	document.getElementById('country').innerHTML = data.sys.country;								// Country

	// Times (UTC)
	var time = new Date(data.dt * 1000).toDateString()
	var fullDate = time.split(' ');
	var date = '<b>' + fullDate[0] + '</b> ' + fullDate[2] + '<sup>th</sup> ' + fullDate[1];

	// Sunrise Calculations
	var sunRiseUTC = new Date((data.sys.sunrise + data.timezone) * 1000).toUTCString();		// Converts unix/epooch to UTC string
	var sunRise = UTCtoLocalTime( sunRiseUTC );

	// Sunset Calculations
	var sunSetUTC = new Date((data.sys.sunset + data.timezone) * 1000).toUTCString();		// Converts unix/epooch to UTC string
	var sunSet = UTCtoLocalTime( sunSetUTC );

	document.getElementById('date').innerHTML = date;												// Date
	document.getElementById('sunrise').innerHTML = '<b>Sunrise </b><br>' + sunRise;					// Sunrise	||	local time
	document.getElementById('sunset').innerHTML = '<b>Sunset </b><br>' + sunSet;					// Sunset	||	local time

	// Change Box colour/gradient to match weather condition
	const element = document.querySelector('.box');	
	
	if( description.indexOf('Clouds') > 0 ) {
		element.className = 'box boxcloudy';
	}
	else if( description.indexOf('Rain') > 0 ) {
		element.className = 'box boxrainy';
	} 
	else {	
		element.className = 'box boxclear';
	}
}

// Five Day Forcast
function drawForcast ( data ) {

	// Forcast Date
	var dayOneDate = new Date(data.list[4].dt * 1000).toDateString();
	var dayTwoDate = new Date(data.list[12].dt * 1000).toDateString();
	var dayThreeDate = new Date(data.list[20].dt * 1000).toDateString();
	var dayFourDate = new Date(data.list[28].dt * 1000).toDateString();
	var dayFiveDate = new Date(data.list[36].dt * 1000).toDateString();

	dayOneDate = dayOneDate.split(" ");
	dayTwoDate = dayTwoDate.split(" ");
	dayThreeDate = dayThreeDate.split(" ");
	dayFourDate = dayFourDate.split(" ");
	dayFiveDate = dayFiveDate.split(" ");

	document.getElementById('dayOneDate').innerHTML = "<b>" + dayOneDate[0] + "<b>";
	document.getElementById('dayTwoDate').innerHTML = "<b>" + dayTwoDate[0] + "<b>";
	document.getElementById('dayThreeDate').innerHTML = "<b>" + dayThreeDate[0] + "<b>";
	document.getElementById('dayFourDate').innerHTML = "<b>" + dayFourDate[0] + "<b>";
	document.getElementById('dayFiveDate').innerHTML = "<b>" + dayFiveDate[0] + "<b>";
	
	// Forcast Description
	var dayOneDesc = data.list[4].weather[0].main;
	var dayTwoDesc = data.list[12].weather[0].main;
	var dayThreeDesc = data.list[20].weather[0].main;
	var dayFourDesc = data.list[28].weather[0].main;
	var dayFiveDesc = data.list[36].weather[0].main;

	document.getElementById('dayOneDesc').innerHTML = weatherIcon( dayOneDesc, data.list[4].clouds.all );
	document.getElementById('dayTwoDesc').innerHTML = weatherIcon( dayTwoDesc, data.list[12].clouds.all );
	document.getElementById('dayThreeDesc').innerHTML = weatherIcon( dayThreeDesc, data.list[20].clouds.all );
	document.getElementById('dayFourDesc').innerHTML = weatherIcon( dayFourDesc, data.list[28].clouds.all );
	document.getElementById('dayFiveDesc').innerHTML = weatherIcon( dayFiveDesc, data.list[36].clouds.all );

	// Forcast Temperature
	var dayOneTemp = Math.round((data.list[4].main.temp) * 10) / 10;
	var dayTwoTemp = Math.round((data.list[12].main.temp) * 10) / 10;
	var dayThreeTemp = Math.round((data.list[20].main.temp) * 10) / 10;
	var dayFourTemp = Math.round((data.list[28].main.temp) * 10) / 10;
	var dayFiveTemp = Math.round((data.list[36].main.temp) * 10) / 10;

	document.getElementById('dayOneTemp').innerHTML = dayOneTemp  + '&deg;';
	document.getElementById('dayTwoTemp').innerHTML = dayTwoTemp + '&deg;';
	document.getElementById('dayThreeTemp').innerHTML = dayThreeTemp + '&deg;';
	document.getElementById('dayFourTemp').innerHTML = dayFourTemp + '&deg;';
	document.getElementById('dayFiveTemp').innerHTML = dayFiveTemp + '&deg;';
}

// --------------------------------------------------------------------------------------------------------------------------------

// Capitalises the first letter of each word from a string
function capitalise ( words ) {
	for (let i = 0; i < words.length; i++) {
		words[i] = words[i][0].toUpperCase() + words[i].substr(1);
	}
	return words;
}

// Converts UTC time to local time || Exclude date
function UTCtoLocalTime ( time ) {
	var newTime = new Date(time.split(' ').slice(0, 5).join(' '));				// Gets just the time || Removes Date

	var hours = newTime.getHours();
	var timeConvention = hours >= 12 ? 'pm' : 'am';		// Sets time convention || AM or PM

	hours = hours % 12;
    hours = hours ? hours : 12;				// Changes to 12-hour time

	var minutes = newTime.getMinutes();

	if( newTime.getSeconds() != 0) {						// Rounds minute up if the time has seconds
		minutes = newTime.getMinutes();
		minutes += 1;
	}

	minutes = minutes < 10 ? '0' + minutes : minutes;		// Adds 0 if minutes are below 10 || digital clock format

	return hours + ':' + minutes + ' ' + timeConvention;
}

// Finds appropriate icon to match weather condition
function weatherIcon ( desc, cloud ) {			
	var rtn = '';

	if( desc == 'Clouds' ) {
		if ( cloud <= 50) {
				rtn = 'partly_cloudy_day';
		} else {
			rtn = 'cloudy';
		}
	} else if( desc == 'Rain' ) {
		rtn = 'rainy';
	} else if( desc == 'Thunderstorm' ) {
		rtn = 'thunderstorm';
	} else if( desc == 'Snow' ) {
		rtn = 'snowing';
	} else if( desc == 'Haze' || desc == 'Mist' ) {
		rtn = 'foggy';
	} else {	
		rtn = 'sunny';
	}

	return rtn;
}

// --------------------------------------------------------------------------------------------------------------------------------

// Toggles between Celsius & Fahrenheit
function swapF() {
	units = 'imperial';
	document.getElementById('c').className = 'disabled';
	document.getElementById('f').className = '';
	showWeather( city[0] );
}

function swapC() {
	units = 'metric';
	document.getElementById('c').className = '';
	document.getElementById('f').className = 'disabled';
	showWeather( city[0] );
}

// --------------------------------------------------------------------------------------------------------------------------------

// Geolocation API || Used to locate a user's position
function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition( showPosition, showError );
	}
}

function showError( error ) {
	switch(error.code) {
	  case error.PERMISSION_DENIED:
		x.innerHTML = "User denied the request for Geolocation"
		break;
	  case error.POSITION_UNAVAILABLE:
		x.innerHTML = "Location information is unavailable."
		break;
	  case error.TIMEOUT:
		x.innerHTML = "The request to get user location timed out."
		break;
	  case error.UNKNOWN_ERROR:
		x.innerHTML = "An unknown error occurred."
		break;
	}
}

// --------------------------------------------------------------------------------------------------------------------------------

function mySearch( event ) { 		// Uses the inputted City by the user || overwrites default
	event.preventDefault();
	city[0] = q.value;
	var name = capitalise( city[0] ); 		// Capitalises First letter
	showWeather( name );
}

function showWeather( name ) {
	weather( name );
	forcast( name );
}

function clearSubmit( event ) {		// Clears search input field
	event.preventDefault();
	document.getElementById('query').value = '';
};


window.onload = function() { 	// Default Weather || Gets overwritten when city is searched
	showWeather( city[0] );
	getLocation();
}

f.addEventListener('submit', mySearch);
f.addEventListener('submit', clearSubmit);
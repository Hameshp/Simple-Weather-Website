const key = '616a15d05f535725598faafae8e5d127'; 	// Personal 'openweathermap' api key

const f = document.getElementById('form');
const q = document.getElementById('query');

function weather( cityName ) {
	fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + key)  
	.then(function(resp) { return resp.json() }) 	// Convert data to json
	.then(function(data) {
		drawWeather(data);
	})
	.catch(function() { 	// Catch any errors
	});
}

function drawWeather( data ) {

	// Weather Description
	var main_description = data.weather[0].main;
	var weather_description = data.weather[0].description;

	const description = weather_description.split(" ");		// Capitalises the first letter of each word from a string
	for (let i = 0; i < description.length; i++) {
		description[i] = description[i][0].toUpperCase() + description[i].substr(1);
	}

	document.getElementById('main-description').innerHTML = main_description.charAt(0).toUpperCase() + main_description.slice(1);;
	document.getElementById('description').innerHTML = description.join(" ");		// Joins the array with a *space*


	// Temperature
	var celcius = Math.round(parseFloat(data.main.temp) - 273.15);
	var min_temp = Math.round(parseFloat(data.main.temp_min) - 273.15);
	var max_temp = Math.round(parseFloat(data.main.temp_max) - 273.15);
	var feels = (parseFloat(data.main.feels_like) - 273.15).toPrecision(2);
	
	document.getElementById('temp').innerHTML = celcius + '&deg;'									// Current Temperature
	document.getElementById('min-temp').innerHTML = 'Min Temperature: ' + min_temp + '&deg;'		// Minimum Temperature
	document.getElementById('max-temp').innerHTML = 'Max Temperature: ' + max_temp + '&deg;'		// Maximum Temperature
	document.getElementById('feels-temp').innerHTML = 'Feels like ' + feels + '&deg;'				// Feels like Temperature

	document.getElementById('humid').innerHTML = 'Humidity: ' + data.main.humidity + '%'			// Humidity
	document.getElementById('cloudiness').innerHTML = 'Cloudiness: ' + data.clouds.all + '%'		// Cloudiness
	

	// Location
	document.getElementById('city').innerHTML = data.name;											// City
	document.getElementById('country').innerHTML = data.sys.country;								// Country


	// Times (UTC)
	var time = new Date(data.dt * 1000).toDateString()
	var fullDate = time.split(' ');

	// Sunrise Calculations
	var sunRiseUTC = new Date((data.sys.sunrise + data.timezone) * 1000).toUTCString();		// Converts unix/epooch to UTC string
	var newSunRiseUTC = new Date(sunRiseUTC.split(' ').slice(0, 5).join(' '));				// Gets just the time || Removes Date
	
	var sunRiseHours = newSunRiseUTC.getHours();
	var timeConventionRise = sunRiseHours >= 12 ? 'pm' : 'am';		// Sets time convention || AM or PM

	sunRiseHours = sunRiseHours % 12;
    sunRiseHours = sunRiseHours ? sunRiseHours : 12;				// Changes to 12-hour time

	if( newSunRiseUTC.getSeconds() != 0) {						// Rounds minute up if the time has seconds
		var sunRiseMinutes = newSunRiseUTC.getMinutes();
		sunRiseMinutes += 1;
	}

	sunRiseMinutes = sunRiseMinutes < 10 ? '0' + sunRiseMinutes : sunRiseMinutes;		// Adds 0 if minutes are below 10 || digital clock format
	var sunRise = sunRiseHours + ':' + sunRiseMinutes + ' ' + timeConventionRise;

	// Sunset Calculations
	var sunSetUTC = new Date((data.sys.sunset + data.timezone) * 1000).toUTCString();		// Converts unix/epooch to UTC string
	var newSunSetUTC = new Date(sunSetUTC.split(' ').slice(0, 5).join(' '));				// Gets just the time || Removes Date

	var sunSetHours = newSunSetUTC.getHours();
	var timeConventionSet = sunSetHours >= 12 ? 'pm' : 'am';		// Sets time convention || AM or PM

	sunSetHours = sunSetHours % 12;
    sunSetHours = sunSetHours ? sunSetHours	 : 12;					// Changes to 12-hour time
	
	
	if( newSunSetUTC.getSeconds() != 0) {						// Rounds minute up if the time has seconds
		var sunSetMinutes = newSunSetUTC.getMinutes();
		sunSetMinutes += 1;
	}
	sunSetMinutes = sunSetMinutes < 10 ? '0' + sunSetMinutes : sunSetMinutes;		// Adds 0 if minutes are below 10 || digital clock format
	var sunSet= sunSetHours + ':' + sunSetMinutes + ' ' + timeConventionSet;


	document.getElementById('date').innerHTML = fullDate[1] + ' ' + fullDate[2];					// Date
	document.getElementById('sunrise').innerHTML = '<b>Sunrise </b><br>' + sunRise;					// Sunrise	||	local time
	document.getElementById('sunset').innerHTML = '<b>Sunset </b><br>' + sunSet;					// Sunset


	// Change Box colour/gradient to match weather condition
	const element = document.querySelector('.box');
	
	if( description.indexOf('Sunny') > 0 ) {
		element.className = 'box boxsunny';
	} 
	else if( description.indexOf('Clouds') > 0 ) {
		element.className = 'box boxcloudy';
	} 
	else if( description.indexOf('Rain') > 0 ) {
		element.className = 'box boxrainy';
	} 
	else {	
		element.className = 'box boxclear';
	}

}



function mySearch( event ) { 		// Uses the inputted City by the user || overwrites default
	event.preventDefault();
	var i = q.value;
	var name = i.charAt(0).toUpperCase() + i.slice(1); 		// Capitalises First letter
	weather( name );
}

function clearSubmit( event ) {		// Clears search input field
	event.preventDefault();
  
	document.getElementById('query').value = '';
};

window.onload = function() { 	// Default Weather || Gets overwritten when city is searched
	weather( 'Auckland' );
}


f.addEventListener('submit', mySearch);
f.addEventListener('submit', clearSubmit);
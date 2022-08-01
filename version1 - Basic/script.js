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
	var celcius = Math.round(parseFloat(data.main.temp)-273.15);
	var description = data.weather[0].description;

	const words = description.split(" ");		// Capitalises the first letter of each word from a string
	for (let i = 0; i < words.length; i++) {
		words[i] = words[i][0].toUpperCase() + words[i].substr(1);
	}

	document.getElementById('description').innerHTML = words.join(" ");		// Joins the array with a *space*
	document.getElementById('temp').innerHTML = celcius + '&deg;'
	document.getElementById('location').innerHTML = data.name + ", " + data.sys.country;

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
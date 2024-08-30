
// Get latitude and longitude given city, state, and country input
function getCoordinates() {
    const city = document.getElementById('cityInput').value;
    const state = document.getElementById('stateInput').value;
    const country = document.getElementById('countryInput').value;

    if (state && !country) {
        alert('Incorrect request. Please also include a country.');
        return;
    }


    const apiNinjasKey = '9TEHNYorXLQRACqUAZA0hQ==jKNIgREtEXtfu033';
    const geocodeApiUrl = `https://api.api-ninjas.com/v1/geocoding?city=${city}&state=${state}&country=${country}&X-Api-Key=${apiNinjasKey}`;

    // Call API
    fetch(geocodeApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Bad network response');
            }
            return response.json();
        })
        .then(data => {
            const latitude = data[0].latitude;
            const longitude = data[0].longitude;

            // Continue by getting forecast data
            getForecast(latitude, longitude, city);
        })
        .catch(error => {
            console.error('Error requesting data:', error);
            alert('Error requesting weather forecast. Please send new request.');
        })   
}

// Get weather forecast data given latitude and longitude
function getForecast(latitude, longitude, city) {
   const weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&timezone=America%2FNew_York`;

   fetch(weatherApiUrl)
       .then(response => {
           if (!response.ok) {
               throw new Error('Bad network response');
           }
           return response.json();
       })
       .then(data => {
           // Continue by displaying data
           displayForecast(data, city);
       })
       .catch(error => {
           console.error('Error requesting data:', error);
           alert('Error requesting weather forecast. Please send new request.');
       })
}

// Display data to HTML page
function displayForecast(data, city) {
    const weatherAppDiv = document.getElementById('weatherApp');

    weatherAppDiv.innerHTML = '';

    var weatherHTML = `
        <h2>${city} 5-Day Forecast</h2>
    `;

    // Add each day's data to html
    for (let i = 0; i < 5; i++) {
        // Process data
        const date = data.daily.time[i].slice(5);
        const futureWeatherCode = getIcon(data.daily.weather_code[i]);
        const tempHigh = (data.daily.temperature_2m_max[i] * (9 / 5) + 32); // Converted C to F
        const tempLow = (data.daily.temperature_2m_min[i] * (9 / 5) + 32); // Converted C to F
        const precipitation = data.daily.precipitation_sum[i] / 25.4; // Converted mm to inches
        const windSpeed = data.daily.wind_speed_10m_max[i] / 1.609; // Converted km/h to mph

        // Add row to HTML
        const futureDateHTML = `
            <div id="weatherDisplay">
                <div id="dateDisplay">
                    <p>${date}</p>
                </div>

                <div id="iconsDisplay">
                    <img src="${futureWeatherCode.icon}">
                    <p> ${futureWeatherCode.description} </p>
                </div>
                <div id="tempsDisplay">
                    <p>Low: ${Math.round(tempLow * 100) / 100} \u2109</p>
                    <p>High: ${Math.round(tempHigh * 100) / 100} \u2109</p>
                </div>
                <div id="additionalInfo">
                    <p>Precipitation: ${Math.round(precipitation * 100) / 100} in</p>
                    <p>Max Wind Speed: ${Math.round(windSpeed * 100) / 100} mph</p>
                </div>
            </div>
        `;
        weatherHTML = weatherHTML + futureDateHTML;
    }

    // Add reset button
    const resetButtonHTML = `
        <button onclick="resetApp()">Reset App</button>
    `;
    weatherHTML = weatherHTML + resetButtonHTML;
   

    weatherAppDiv.innerHTML = weatherHTML;

}

// Reset weather app to default state 
function resetApp() {
    const weatherAppDiv = document.getElementById('weatherApp');

    weatherAppDiv.innerHTML = '';
    weatherAppDiv.innerHTML = `
        <h2>Weather App</h2>
        <input type="text" id="cityInput" placeholder="Enter city" />
        <input type="text" id="stateInput" placeholder="Enter state (optional, must also include country)" />
        <input type="text" id="countryInput" placeholder="Enter country (optional)" />

        <button onclick="getCoordinates()">Show Forecast</button>
    `;
}

// Take given weather code and use mapping to correct description and icon
function getIcon(weatherCode) {
    const codeMapping = {
        "0": {
            "description": "Clear Sky",
            "icon": "http://openweathermap.org/img/wn/01d@2x.png"
        },
        "1": {
            "description": "Mainly Clear",
            "icon": "http://openweathermap.org/img/wn/01d@2x.png"
        },
        "2": {
            "description": "Partly Cloudy",
            "icon": "http://openweathermap.org/img/wn/02d@2x.png"
        },
        "3": {
            "description": "Overcast",
            "icon": "http://openweathermap.org/img/wn/03d@2x.png"
        },
        "45": {
            "description": "Fog",
            "icon": "http://openweathermap.org/img/wn/50d@2x.png"
        },
        "48": {
            "description": "Rime Fog",
            "icon": "http://openweathermap.org/img/wn/50d@2x.png"
        },
        "51": {
            "description": "Light Drizzle",
            "icon": "http://openweathermap.org/img/wn/09d@2x.png"
        },
        "53": {
            "description": "Moderate Drizzle",
            "icon": "http://openweathermap.org/img/wn/09d@2x.png"
        },
        "55": {
            "description": "Heavy Drizzle",
            "icon": "http://openweathermap.org/img/wn/09d@2x.png"
        },
        "56": {
            "description": "Light Freezing Drizzle",
            "icon": "http://openweathermap.org/img/wn/09d@2x.png"
        },
        "57": {
            "description": "Freezing Drizzle",
            "icon": "http://openweathermap.org/img/wn/09d@2x.png"
        },
        "61": {
            "description": "Light Rain",
            "icon": "http://openweathermap.org/img/wn/10d@2x.png"
        },
        "63": {
            "description": "Moderate Rain",
            "icon": "http://openweathermap.org/img/wn/10d@2x.png"
        },
        "65": {
            "description": "Heavy Rain",
            "icon": "http://openweathermap.org/img/wn/10d@2x.png"
        },
        "66": {
            "description": "Light Freezing Rain",
            "icon": "http://openweathermap.org/img/wn/10d@2x.png"
        },
        "67": {
            "description": "Heavy Freezing Rain",
            "icon": "http://openweathermap.org/img/wn/10d@2x.png"
        },
        "71": {
            "description": "Light Snow",
            "icon": "http://openweathermap.org/img/wn/13d@2x.png"
        },
        "73": {
            "description": "Moderate Snow",
            "icon": "http://openweathermap.org/img/wn/13d@2x.png"
        },
        "75": {
            "description": "Heavy Snow",
            "icon": "http://openweathermap.org/img/wn/13d@2x.png"
        },
        "77": {
            "description": "Snow Grains",
            "icon": "http://openweathermap.org/img/wn/13d@2x.png"
        },
        "80": {
            "description": "Light Showers",
            "icon": "http://openweathermap.org/img/wn/09d@2x.png"
        },
        "81": {
            "description": "Moderate Showers",
            "icon": "http://openweathermap.org/img/wn/09d@2x.png"
        },
        "82": {
            "description": "Heavy Showers",
            "icon": "http://openweathermap.org/img/wn/09d@2x.png"
        },
        "85": {
            "description": "Light Snow Showers",
            "icon": "http://openweathermap.org/img/wn/13d@2x.png"
        },
        "86": {
            "description": "Heavy Snow Showers",
            "icon": "http://openweathermap.org/img/wn/13d@2x.png"
        },
        "95": {
            "description": "Thunderstorm",
            "icon": "http://openweathermap.org/img/wn/11d@2x.png"
        },
        "96": {
            "description": "Thunderstorm with slight hail",
            "icon": "http://openweathermap.org/img/wn/11d@2x.png"
        },
        "99": {
            "description": "Thunderstorm with heavy hail",
            "icon": "http://openweathermap.org/img/wn/11d@2x.png"
        }
    };

    return codeMapping[weatherCode];
}

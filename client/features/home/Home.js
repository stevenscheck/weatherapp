import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSelector } from 'react-redux';
import morning2 from '../../../public/images/morning2.jpeg'
import evening2 from '../../../public/images/evening2.jpeg'
import sunny from '../../../public/images/sunny.jpeg'
import partly from '../../../public/images/partlycloud.png'
import overcast from '../../../public/images/overcast.png'
// import { google } from 'google-maps';

/**
 * COMPONENT
 */
const Home = (props) => {
  const api_key = 'd87d1cbe3b966c3de0c453d7aafb0b48'
  const [currentTemp, setCurrentTemp] = useState('')
  const [cityInput, setCityInput] = useState('');
  const [cityOptions, setCityOptions] = useState([]);
  const [load, setLoad] = useState(false)
  const [check, setCheck] = useState(0)
  const [unix, setUnix] = useState(0)
  const [currentTime , setCurrentTime] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const [timeZone, setTimeZone] = useState('');
  const [location, setLocation] = useState('')
  const [weatherInfoStyle, setWeatherInfoStyle] = useState({})
  const [clouds, setClouds] = useState('')


  

  const getCurrentWeather = () => {
    const encodedCity = encodeURIComponent(cityInput)
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&units=imperial&appid=${api_key}`).then((res) => {
    setCurrentTemp(res.data.main.temp)
    setLocation(res.data.name)
    setClouds(res.data.weather.description)
    setUnix(res.data.dt)
    setIsLoading(false)
    axios.get(`https://maps.googleapis.com/maps/api/timezone/json?location=${res.data.coord.lat},${res.data.coord.lon}&timestamp=${res.data.dt}&key=AIzaSyDSegxssrK-zOEkHd7Lab2nMFbTN2dlFJQ`)
    .then((res) => {
      setTimeZone(res.data.timeZoneId);
    })
    .catch((err) => {
      console.log(err);
    });
    })
    .catch(err => console.log(err))
    axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${encodedCity}&units=imperial&appid=${api_key}
    `).then(res => console.log(res)).catch(err => console.log(err))
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&units=imperial&appid=${api_key}`).then((res) => console.log(res.data))
  }

  const handleInputChange = (e) => {
    // Update the city input state with the new input value
    setCityInput(e.target.value)
  };  

  useEffect(() => {
    if(timeZone){
      console.log(timeZone)
      var date_object = new Date(unix * 1000);
      const da = date_object.toLocaleTimeString("en-US", { hour12: true, timeZone: timeZone });
      setCurrentTime(da)
    }
  }, [timeZone])

  useEffect(() => {
    if(currentTime){
    changeBackground()
    }
  }, [currentTime])

  const handleCitySelect = (selectedOption) => {
    setIsLoading(true)
    setCityInput(selectedOption)
    setCheck(check + 1)
    setLoad(!load)
    setCityOptions([])
  };


 const changeBackground = () => {
  console.log('hi')
  let hour = currentTime.split((/:|\s/))
  // if(parseInt(hour[0]) > 6 && parseInt(hour[0]) < 12 && hour[3] === 'AM'){
    
  // }
  let backgroundImage = '';

  if (parseInt(hour[0]) >= 6 && parseInt(hour[0]) < 1 && hour[3] === 'AM' || parseInt(hour[0]) >= 1 && parseInt(hour[0]) < 7 && hour[3] === 'PM' && clouds === 'clear sky') {
    // backgroundImage = morning2;
    setWeatherInfoStyle({
      backgroundImage: `url(${sunny})`
    })
  } else if (parseInt(hour[0]) >= 6 && parseInt(hour[0]) < 1 && hour[3] === 'AM' || parseInt(hour[0]) >= 1 && parseInt(hour[0]) < 7 && hour[3] === 'PM' && clouds === 'broken clouds' || 'few clouds' || 'scattered clouds') {
    // backgroundImage = evening2;
    setWeatherInfoStyle({
      backgroundImage: `url(${partly})`
    })
  } else if (parseInt(hour[0]) >= 6 && parseInt(hour[0]) < 1 && hour[3] === 'AM' || parseInt(hour[0]) >= 1 && parseInt(hour[0]) < 7 && hour[3] === 'PM' && clouds === 'overcast clouds') {
    // backgroundImage = 'url(night.jpg)';
    setWeatherInfoStyle({
      backgroundImage: `url(${overcast})`
    })
  }

  const bodyStyles = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundRepeat: 'no-repeat',
  }

  Object.assign(document.body.style, bodyStyles);
 }



  // const sessionToken = new google.maps.places.AutocompleteSessionToken();
  const auto = new google.maps.places.AutocompleteService();


  useEffect(() => {
    if(check > 0){
    getCurrentWeather()
    }
  }, [load])

  useEffect(() => {

    // Retrieve a list of city suggestions from the Google Places Autocomplete API
    auto.getPlacePredictions(
      { input: cityInput, types: ['(cities)'] },
      (results) => {
        // Map the results to an array of city option objects
        const options = results.map((result) => ({
          value: result.description,
          label: result.description,
        }));
        // Update the city options state with the new options
        setCityOptions(options);
      }
    );
  }, [cityInput]);


  return (  
    <div className='mainPage'>
      <div>
      <h3>Welcome</h3>
      <input type='text' placeholder='Enter A Location' value={cityInput} onChange={handleInputChange} />
      <ul>
      {cityOptions.map((option) => {
        if(cityInput.length > 0){
          return(
          <li onClick={() => handleCitySelect(option.label)} key={option.value} value={option.value}>
            {option.label}
          </li>
          )
        }
        })}
      </ul>
      </div>
      <div>
      {isLoading ? <CircularProgress /> : null}
      {currentTemp ? 
      <div className='weatherInfo' style={weatherInfoStyle}>
        <h4>Weather For {location}</h4>
        <h3>Local Time: {currentTime}</h3>
        <h3>Current Temp: {currentTemp}°F</h3>
      </div>
      : null}
      </div>
    </div>
  );
};

export default Home;

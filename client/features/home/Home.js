import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSelector } from 'react-redux';
import morning2 from '../../../public/images/morning2.jpeg'
import evening2 from '../../../public/images/evening2.jpeg'
import sunny from '../../../public/images/sunny.jpeg'
import partly from '../../../public/images/partlycloud.png'
import overcast from '../../../public/images/overcast.png'
import sunshine1 from '../../../public/images/sunshine1.jpeg'
import wow from '../../../public/images/wow.jpeg'
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
  const [isLoading, setIsLoading] = useState(false);
  const [zone, setZone] = useState('');
  const [location, setLocation] = useState('')
  const [weatherInfoStyle, setWeatherInfoStyle] = useState({})
  const [clouds, setClouds] = useState('')
  const [how, setHow] = useState(false)
  const [bet, setBet] = useState(0)
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [pId, setPId] = useState('')
  const [milTime, setMilTime] = useState('')
  const [pl, setPl] = useState(false)
  const [imgUrl, setImgUrl] = useState('')
  const [feelsLike, setFeelsLike] = useState('')
  const [tempHigh, setTempHigh] = useState('')
  const [tempLow, setTempLow] = useState('')
  const [icon, setIcon] = useState('')
  const [hourlyData, setHourlyData] = useState([]);
  const [a, setA] = useState('')
  const [day, setDay] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [count, setCount] = useState(0)
  const [cur, setCur] = useState('')
  

  const getCurrentWeather = () => {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=imperial&appid=${api_key}`).then((res) => {
    setCurrentTemp(res.data.main.temp)
    setLocation(cityInput)
    setClouds(res.data.weather[0].description)
    setUnix(res.data.dt)
    setFeelsLike(res.data.main.feels_like)
    setTempHigh(res.data.main.temp_max)
    setTempLow(res.data.main.temp_min)
    setIcon(res.data.weather[0].icon)
    setIsLoading(false)
    setA(res.data.timezone)
    setCur(res.data.dt)
    setImgUrl(`https://openweathermap.org/img/wn/${res.data.weather[0].icon}@2x.png`)
    setPl(!pl)
    axios.get(`https://maps.googleapis.com/maps/api/timezone/json?location=${res.data.coord.lat},${res.data.coord.lon}&timestamp=${res.data.dt}&key=AIzaSyDSegxssrK-zOEkHd7Lab2nMFbTN2dlFJQ`)
    .then((res) => {
      setZone(res.data.timeZoneId);
    })
    .catch((err) => {
      console.log(err);
    });
    })
    .catch(err => console.log(err))
    axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${api_key}&units=imperial&timezone=Australia/Sydney
    `).then(res => {
      setHourlyData(res.data.list);
    })
    .catch(error => console.log(error));
    axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=imperial&appid=${api_key}`).then((res) => console.log(res.data))
    axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${api_key}&units=imperial&timezone=Australia/Sydney`).then(res => console.log(res.data))
  }

  const handleInputChange = (e) => {
    // Update the city input state with the new input value
    setCityInput(e.target.value)
  };  

  useEffect(() => {
    if(zone){
      const p = cur + 25200 + a
      const currentTime = new Date(p * 1000)
      setDay(currentTime.toLocaleDateString())
    }
    setHow(!how)
  }, [pl, zone])

  useEffect(() => {
    changeBackground()
  }, [how])

  const handleCitySelect = (selectedOption) => {
    setCityOptions([])
    setIsLoading(true)
    setCityInput('')
    setPId(selectedOption.placeId)
    setBet(bet + 1)
    setLoad(!load)
  };

  useEffect(() => {
    if(hourlyData.length){
      console.log('1')
    const filtered = (hourlyData.filter((item) => {
      const o = (item.dt + 25200 + a)
      const currentTime = new Date(o * 1000); 
      console.log(currentTime.toLocaleTimeString(), currentTime, item.main.temp)
      console.log(currentTime.toLocaleDateString(), day)
      return currentTime.toLocaleDateString() == day
    }))
    setFilteredData(filtered)
  }
  }, [hourlyData])

  function convertTime(time){
    const w = time + 25200 + a
    const currentTime = new Date(w * 1000); 
    const timeArray = currentTime.toLocaleTimeString().split(/:|\s/)
    return [timeArray[0],' ',timeArray[3]]
  } 

 const changeBackground = () => {
  let hour = milTime.split((/:|\s/))


  if(icon === '01d' || icon === '02d' ){
    setWeatherInfoStyle({
      backgroundImage: `url(${sunshine1})`
    })
  } else if(icon === '03d' || icon === '04d' || icon === '09d' || icon === '10d' || icon === '11d' || icon === '13d' || icon === '50d'){
    console.log('fasdfdas')
    setWeatherInfoStyle({
      backgroundImage: `url(${wow})`,
      WebkitBackgroundSize: 'cover',
      MozBackgroundSize: 'cover',
      OBackgroundSize: 'cover',
      backgroundSize: 'cover'
    })
  }
 }


const getLatLng = () => {
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ placeId: pId }, (results, status) => {
    if (status === "OK") {
      setLat(results[0].geometry.location.lat())
      setLng(results[0].geometry.location.lng())
      setCheck(check + 1)
    } else {
      console.log("Geocode was not successful for the following reason:", status);
    }
  });
}


  const auto = new google.maps.places.AutocompleteService();


  useEffect(() => {
    if(check > 0){
    getCurrentWeather()
    }
  }, [check])

  useEffect(() => {
    if(bet > 0){
    getLatLng()
    }
  }, [load])

  useEffect(() => {

    // Retrieve a list of city suggestions from the Google Places Autocomplete API
    auto.getPlacePredictions(
      { input: cityInput, types: ['(cities)'] },
      (results) => {
        // Map the results to an array of city option objects
        const options = results.map((result) => {
          return(
          {
          placeId: result.place_id,
          value: result.description,
          label: result.description,
          }
          )
        });
        // Update the city options state with the new options
        setCityOptions(options);
      }
    );
  }, [cityInput]);


  return (  
    <div className='mainPage'>
      <div>
      {/* <h3>Welcome</h3> */}
      <input className='locationInput' type='text' placeholder='Enter A City' value={cityInput} onChange={handleInputChange} />
      {cityOptions.length && cityInput ? 
      <ul className='cityOptions'>
      {cityOptions.map((option) => {
        if(cityInput.length > 0){
          return(
          <li onClick={() => handleCitySelect(option)} key={option.value} value={option.value}>
            {option.label}
          </li>
          )
        }
        })}
      </ul>
      : null}
      </div>
      <div className='information'>
      <div>
      {isLoading ? <CircularProgress /> : null}
      {currentTemp ? 
      <div className='cl1' style={weatherInfoStyle}>
      <div className='weatherInfo'>
        <h2>{location}</h2>
        <h2>{currentTemp}°F</h2>
        <h4>{clouds}</h4>
        <h4>Feels Like {feelsLike}</h4>
        <h4>High {tempHigh} • Low {tempLow}</h4>
      </div>

      <img src={imgUrl} />
      </div>
      : null}
      </div>
      <div>
      {filteredData.length ?
      <ul className='hourlyContainer'>
          {filteredData.map(item => (
          <li key={item.dt} className='hourly'>
            <div>{convertTime(item.dt)} </div> 
            <div>{item.main.temp}°F</div>
            <img className='hourlyIcon' src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`} />
          </li>
        ))} 
        </ul>
        : null} 
    </div>
    </div>
    </div>
  );
};

export default Home;

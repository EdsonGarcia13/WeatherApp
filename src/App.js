import './App.css';
import React, {useEffect, useState} from 'react';
import axios from 'axios';

const api = {
  key: "02220a46c2032c864ea07bd04c47d8a3",
  base: "https://api.openweathermap.org/data/2.5/"
}

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});

  const search = evt => {
    if (evt.key === "Enter") {
      fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then(res => res.json())
        .then(result => {
          setWeather(result);
          setQuery('');
          console.log(result);
        });
    }
  }
  const success = pos => {
    const latitude = pos.coords.latitude;
    const longitude = pos.coords.longitude;
     axios.get(`${api.base}weather?lat=${latitude}&lon=${longitude}&units=metric&APPID=${api.key}`)
     .then(res => setWeather (res.data));
  }
  useEffect (() => {
    navigator.geolocation.getCurrentPosition(success);
  }, []);

  const [isClick, setIsClick] = useState(false);

  const handleClick = () => {
    setIsClick(!isClick);
  }

  const convertion = (temp) => {
    const fahrenheit= ((temp * 9/5) + 32).toFixed(2)+"°F";
    const centigrade = temp.toFixed(2) + "°C";
    return isClick ? fahrenheit : centigrade;
  }
  

  const dateBuilder = (d) => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`
  }
  
  return (
    <div className={(typeof weather.main != "undefined") ? ((weather.main.temp < 16) ? 'app warm' : 'app'): 'app'}>
      <main>
        <div className="search-box">
          <input 
            type="text"
            className="search-bar"
            placeholder="Search..."
            onChange={e => setQuery(e.target.value)}
            value={query}
            onKeyPress={search}
          />
        </div>

        {(typeof weather.main != "undefined") ? (
        <div>
          <div className="location-box">
            
            <div className="location">{weather.name}, {weather.sys.country}</div>
            <div className="date">{dateBuilder(new Date())}</div>
          </div>
          <div className="weather-box">
            <div className="temp">
              {convertion(weather.main.temp)}
            </div>
            <button className='button-convertion' onClick={handleClick}>Convertion</button>
            <div className="weather">{weather.weather[0].main}</div>
            <img className='icon' src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="" />
          </div>
        </div>
        ) : ('')}
        
        
      </main>
    </div>
  );
}

export default App;

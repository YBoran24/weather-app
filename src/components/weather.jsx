import React, { useEffect, useState, useRef } from 'react';
import './Weather.css';

import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';
import humidity_icon from '../assets/humidity.png';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03n": cloud_icon,
    "03d": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon
  };

  const search = async (city) => {
    if (!city) {
      alert("Lütfen geçerli bir şehir ismi giriniz");
      return;
    }
    try {
      const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}&lang=tr`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}&lang=tr`;

      const [currentRes, forecastRes] = await Promise.all([
        fetch(currentUrl),
        fetch(forecastUrl)
      ]);

      const currentData = await currentRes.json();
      const forecastData = await forecastRes.json();

      if (!currentRes.ok || currentData.cod !== 200) {
        alert(currentData.message || "Şehir bulunamadı!");
        return;
      }

      const icon = allIcons[currentData.weather[0].icon] || clear_icon;
      setWeatherData({
        humidity: currentData.main.humidity,
        windSpeed: currentData.wind.speed,
        temperature: Math.floor(currentData.main.temp),
        feels_like: Math.floor(currentData.main.feels_like),
        location: currentData.name,
        icon: icon
      });

      const daily = forecastData.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 5);
      const dayNamesTR = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
      const dailyForecast = daily.map(day => {
        const date = new Date(day.dt_txt);
        return {
          date: dayNamesTR[date.getDay()],
          temp: Math.floor(day.main.temp),
          icon: allIcons[day.weather[0].icon] || clear_icon
        };
      });

      console.log("Günlük tahmin verileri:", dailyForecast);
      setForecast(dailyForecast);

    } catch (error) {
      console.error("API hatası:", error);
    }
  };

  useEffect(() => {
    search("Istanbul");
  }, []);

  const addFavorite = () => {
    if (weatherData && !favorites.includes(weatherData.location)) {
      const updated = [...favorites, weatherData.location];
      setFavorites(updated);
      localStorage.setItem("favorites", JSON.stringify(updated));
    }
  };

  const removeFavorite = (city) => {
    const updated = favorites.filter(fav => fav !== city);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  // Günler arası fark hesaplama
  const forecastWithDiff = forecast && forecast.length > 0 
    ? forecast.map((day, index) => {
        if (index === 0) return { ...day, diff: 0 };
        return { ...day, diff: day.temp - (forecast[index - 1]?.temp || 0) };
      })
    : [];

  // Grafik verisi
  const chartData = {
    labels: forecastWithDiff.map(day => day.date),
    datasets: [
      {
        label: "Sıcaklık (°C)",
        data: forecastWithDiff.map(day => day.temp),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
        fill: true
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
      title: { display: true, text: '5 Günlük Sıcaklık Grafiği' }
    }
  };

  return (
    <div className="weather-container">

      {/* Ana Hava Durumu Kutusu */}
      <div className="weather-main">
        <div className="search-bar">
          <input ref={inputRef} type="text" placeholder='Şehir ara...' />
          <img src={search_icon} alt="Search" onClick={() => search(inputRef.current.value)} />
        </div>

        {weatherData && (
          <>
            <img src={weatherData.icon} alt="Weather Icon" className='weather-icon' />
            <p className='temperature'>{weatherData.temperature}°C</p>
            <p className='location'>{weatherData.location}</p>
            <p className='feels-like'>Hissedilen: {weatherData.feels_like}°C</p>

            <button onClick={addFavorite} className="add-favorite">⭐ Favorilere Ekle</button>

            <div className="weather-data">
              <div className="col">
                <img src={humidity_icon} alt="Nem" />
                <div>
                  <p>{weatherData.humidity}%</p>
                  <span>Nem</span>
                </div>
              </div>
              <div className="col">
                <img src={wind_icon} alt="Rüzgar" />
                <div>
                  <p>{weatherData.windSpeed} km/h</p>
                  <span>Rüzgar Hızı</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Favoriler */}
      <div className="favorites">
        <h3>Kaydedilenler</h3>
        {favorites.length === 0 && <p>Favori şehir ekleyin!</p>}
        {favorites.map((city, index) => (
          <div key={index} className="favorite-item">
            <button onClick={()=> search(city)}>{city}</button>
            <button className="remove-btn" onClick={() => removeFavorite(city)}>❌</button>
          </div>
        ))}
      </div>

      {/* 5 Günlük Tahmin */}
      <div className="forecast-grid">
        {forecast.map((day, index) => (
          <div key={index} className="forecast-card">
            <p className="forecast-day">{day.date}</p>
            <img src={day.icon} alt="icon" />
            <p className="temperature">{day.temp}°C</p>
          </div>
        ))}
      </div>

      {/* Grafik tahminlerin altında */}
      <div className="temp-chart-container">
        {forecast && forecast.length > 0 && (
          <Line data={chartData} options={chartOptions} />
        )}
      </div>

    </div>
  );
};

export default Weather;

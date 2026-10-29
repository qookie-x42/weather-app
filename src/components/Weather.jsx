import { useEffect, useRef, useState } from "react"
import axios from "axios";
import "./Weather.css"
import clear_day from "../../public/01d.png"
import clear_night from "../../public/01n.png"
import cloudy_day from "../../public/02d.png"
import cloudy_night from "../../public/02n.png"
import overcast from "../../public/03.png"
import broken_cloud from "../../public/04.png"
import shower_rain from "../../public/09.png"
import rain_day from "../../public/10d.png"
import rain_night from "../../public/10n.png"
import thunderstorm from "../../public/11.png"
import snow from "../../public/13.png"
import mist from "../../public/50.png"
import search from "../../public/search.png"
import humidity from "../../public/humidity.png"
import wind from "../../public/wind.png"

export function Weather() {
	const inputRef = useRef();
	const [weatherData, setWeatherData] = useState(false);

	const all_icons = {
		"01d": clear_day,
		"01n": clear_night,
		"02d": cloudy_day,
		"02n": cloudy_night,
		"03d": overcast,
		"03n": overcast,
		"04d": broken_cloud,
		"04n": broken_cloud,
		"09d": shower_rain,
		"09n": shower_rain,
		"10d": rain_day,
		"10n": rain_night,
		"11d": thunderstorm,
		"11n": thunderstorm,
		"13d": snow,
		"13n": snow,
		"50d": mist,
		"50n": mist
	};

	async function searchCity(city) {
		if(city == ""){
			alert("Enter a city name!");
			return;
		}
		try {
			const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;

			const response = await fetch(url);
			const data = await response.json();

			if(!response.ok){
				alert(data.message);
				return;
			}

			setWeatherData({
				humidity: data.main.humidity,
				wind_speed: data.wind.speed,
				temperature: Math.floor(data.main.temp),
				location: data.name,
				icon: all_icons[data.weather[0].icon] || clear
			});
		} catch (error) {
			setWeatherData(false);
			console.error(error);
		}
	}

	async function getLocation() {
		const res = await axios.get("https://ipapi.co/json");
		if (res.data.city) {
			await searchCity(res.data.city);
		}
	}
	useEffect(() => {
  	getLocation();
	}, []);

	return (
		<section className="weather">
			<search>
				<input
					type="search"
					placeholder="Search"
					id="searchInput"
					ref={inputRef}
				/>
				<img src={search}
					id="searchButton"
					onClick={() => {
						searchCity(inputRef.current.value);
						inputRef.current.value = "";
					}}
				/>
			</search>
			{weatherData?<>
				<img 
					src={weatherData.icon}
					className="weather-icon"
				/>
				<p className="temperature">{weatherData.temperature}°C</p>
				<p className="location">{weatherData.location}</p>
				<div className="weather-data">
					<div className="col">
						<img src={humidity} />
						<div>
							<p>{weatherData.humidity} %</p>
							<span>Humidity</span>
						</div>
					</div>
					<div className="col">
						<img src={wind} />
						<div>
							<p>{weatherData.wind_speed} km/h</p>
							<span>Wind Speed</span>
						</div>
					</div>
				</div>
			</>:<></>}
		</section>
	);
}

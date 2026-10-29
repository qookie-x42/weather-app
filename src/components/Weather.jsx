import { useEffect, useRef, useState } from "react"
import axios from "axios";
import "./Weather.css"
import clear from "../../public/clear.png"
import cloud from "../../public/cloud.png"
import drizzle from "../../public/drizzle.png"
import humidity from "../../public/humidity.png"
import rain from "../../public/rain.png"
import search from "../../public/search.png"
import snow from "../../public/snow.png"
import wind from "../../public/wind.png"

export function Weather() {
	const inputRef = useRef();
	const [weatherData, setWeatherData] = useState(false);

	const all_icons = {
		"01d": clear,
		"01n": clear,
		"02d": cloud,
		"02n": cloud,
		"03d": cloud,
		"03n": cloud,
		"04d": drizzle,
		"04n": drizzle,
		"09d": rain,
		"09n": rain,
		"10d": rain,
		"10n": rain,
		"13d": snow,
		"13n": snow
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

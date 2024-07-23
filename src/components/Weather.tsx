import { useEffect, useState } from "react";
import styles from "../styles/weather.module.css"

type WeatherData = {
    main: Main;
    weather: Weather[];
};

type Main = {
    temp: number;
};

type Weather = {
    icon: string;
    description: string;
};

export default function Weather() {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

    useEffect(() => {
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?lat=47.499950&lon=8.737565&appid=2a245603702c49e78398112dd3a23830&units=metric"
        )
            .then((response) => response.json())
            .then((data) => {
                setWeatherData(data);
            });
    }, []);



    return (
        <div>
            {weatherData ? (
                <>
                    <h4>{weatherData.main.temp}°C</h4>
                    <p>
                        <img
                            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                            alt={weatherData.weather[0].description}
                        />
                        <p>{weatherData.weather[0].description}</p>
                    </p>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

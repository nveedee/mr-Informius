import { useEffect, useState } from "react";
import styles from "../styles/weather.module.css";

type WeatherData = {
    main: Main;
    wind: Wind;
    weather: Weather[];
};

type Main = {
    temp: number;
};

type Wind = {
    speed: number;
    deg: number; // Windrichtung
};

type Weather = {
    icon: string;
    description: string;
};

export default function WeatherCarousel() {
    const [weatherDataList, setWeatherDataList] = useState<WeatherData[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const response = await fetch(
                    "https://api.openweathermap.org/data/2.5/weather?lat=47.499950&lon=8.737565&appid=2a245603702c49e78398112dd3a23830&units=metric"
                );
                const data = await response.json();
                setWeatherDataList([
                    data, // Originaldaten
                    { ...data, wind: { ...data.wind } } // Kopie der Daten mit Windgeschwindigkeit
                ]);
            } catch (error) {
                console.error("Failed to fetch weather data", error);
            }
        };

        fetchWeatherData();
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % weatherDataList.length);
        }, 15000); // Wechselt alle 15 Sekunden

        return () => clearInterval(intervalId); // Bereinigt den Intervall-Handler bei der Demontage
    }, [weatherDataList.length]);

    const renderWeatherCard = (data: WeatherData) => {
        // Konvertiert Grad in eine Richtung (z.B. 'N', 'NE', 'E', etc.)
        const windDirection = (degree: number) => {
            const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
            return directions[Math.round(((degree % 360) / 45)) % 8];
        };

        return (
            <div
                className={styles.weatherContainer}
                onClick={() => setCurrentIndex((prevIndex) => (prevIndex + 1) % weatherDataList.length)}
                style={{ cursor: 'pointer' }}
            >
                {currentIndex === 1 ? (
                    <div>
                        <h4 className={styles.temperature}>
                           {data.wind.speed} m/s
                        </h4>
                        <p>
                            Wind Direction: {windDirection(data.wind.deg)}
                        </p>
                    </div>
                ) : (
                    <div>
                        <h4 className={styles.temperature}>{data.main.temp}°C</h4>
                        <p>
                            <img
                                src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                                alt={data.weather[0].description}
                            />
                            <span className={styles.description}>{data.weather[0].description}</span>
                        </p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={styles.weatherWrapper}>
            {weatherDataList.length > 0 && renderWeatherCard(weatherDataList[currentIndex])}
        </div>
    );
}

import { useEffect, useState } from "react";
import styles from '../styles/sbb.module.css';

type PersonData = {
    name: string;
    city: string;
};

type ConnectionData = {
    duration: string;
    sections: route[];
};

type route = {
    departure: departure;
    arrival: arrival;
    journey: journey | null;
};

type journey = {
    category: string;
    number: string;
    passList: passList[];
};

type passList = {
    platform: string;
};

type departure = {
    station: station;
    departureTimestamp: number;
};

type arrival = {
    station: station;
    arrivalTimestamp: number;
};

type station = {
    name: string;
};

export default function SbbApi() {
    const [data, setData] = useState<PersonData[]>([]);
    const [connection, setConnection] = useState<ConnectionData | null>(null);
    const [numbernow, setNumbernow] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetch('/home.json')
            .then(response => response.json())
            .then(data => {
                setData(data);
                setLoading(false); // Data is loaded, stop showing the GIF
            })
            .catch(error => {
                console.error('Error fetching the Json file:', error);
                setLoading(false); // Stop loading even if there's an error
            });
    }, []);

    useEffect(() => {
        if (data.length > 0) {
            setLoading(true); // Start showing the GIF when fetching new connection data
            fetchConnection(data[numbernow].city);
        }
    }, [data, numbernow]);

    function fetchConnection(city: string) {
        fetch(`https://transport.opendata.ch/v1/connections?from=pionierstrasse3&to=${city}`)
            .then(response => response.json())
            .then(data => {
                setConnection(data.connections[0]);
                setLoading(false); // Data is loaded, stop showing the GIF
            })
            .catch(error => {
                console.error('Error fetching connection data:', error);
                setLoading(false); // Stop loading even if there's an error
            });
    }

    function convertDurationToMinutes(duration: string): number {
        const match = duration.match(/^(\d+)d(\d+):(\d+):(\d+)$/);

        if (match) {
            const days = Number(match[1]);
            const hours = Number(match[2]);
            const minutes = Number(match[3]);
            const seconds = Number(match[4]);

            return (days * 24 * 60) + (hours * 60) + minutes + Math.round(seconds / 60);
        } else {
            console.error("Unexpected duration format:", duration);
            return 0;
        }
    }

    return (
        <div className={styles.stationContainer}>
            <div className={styles.dropdownContainer}>
                <select
                    value={numbernow}
                    onChange={(e) => setNumbernow(Number(e.target.value))}
                    className={styles.dropdown}
                >
                    {data &&
                        data.map((person, index) => (
                            <option key={index} value={index}>
                                {person.name}
                            </option>
                        ))}
                </select>
            </div>
            <h2 className={styles.cardTitle}>
                SBB Fahrplan nach {data.length > 0 ? data[numbernow]?.city : "Loading..."}
            </h2>

            {loading ? (
                <div className={styles.loadingGif}>
                    <img src="/public/three-11928_256.gif" alt="loading"/>
                </div>
            ) : (
                connection ? (
                    <div className={styles.connectionDetails}>
                        <p>Die Reise dauert <strong>{convertDurationToMinutes(connection.duration)}</strong> Minuten (<i>Laufzeit
                            mit eingerechnet</i>)</p>
                        <div className={styles.sections}>
                            {connection.sections
                                .filter(section => section.journey)
                                .map((section, index) => (
                                    <div key={index} className={styles.section}>
                                        <div className={styles.stationInfo}>
                                            <h3>Abfahrt</h3>
                                            <p>Station: {section.departure.station.name}</p>
                                            <p>Zeit: {new Date(section.departure.departureTimestamp * 1000).toLocaleTimeString()}</p>
                                        </div>
                                        <div className={styles.stationInfo}>
                                            <h3>Ankunft</h3>
                                            <p>Station: {section.arrival.station.name}</p>
                                            <p>Zeit: {new Date(section.arrival.arrivalTimestamp * 1000).toLocaleTimeString()}</p>
                                        </div>
                                        {section.journey && (
                                            <div className={styles.journeyInfo}>
                                                <h3>{section.journey.category} {section.journey.number}</h3>
                                                <p>Plattform: {section.journey.passList[0]?.platform || 'Unbekannt'}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>
                    </div>
                ) : (
                    <p>Es gibt keine Reise nach {data.length > 0 ? data[numbernow]?.city : "Loading..."}</p>
                )
            )}
        </div>
    );
}

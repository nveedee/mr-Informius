import { useEffect, useState } from "react";
import styles from '../styles/sbb.module.css';

type ConnectionData = {
    duration: string;
    sections: Route[];
};

type Route = {
    departure: Departure;
    arrival: Arrival;
    journey: Journey | null;
};

type Journey = {
    category: string;
    number: string;
    passList: PassList[];
};

type PassList = {
    platform: string;
};

type Departure = {
    station: Station;
    departureTimestamp: number;
};

type Arrival = {
    station: Station;
    arrivalTimestamp: number;
};

type Station = {
    name: string;
};

type TakeMeHomeProps = {
    city: string;
};

export default function TakeMeHome({ city }: TakeMeHomeProps) {
    const [connection, setConnection] = useState<ConnectionData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (city) {
            setLoading(true);
            fetchConnection(city);
        }
    }, [city]);

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
            <h2 className={styles.cardTitle}>
                SBB Fahrplan nach {city}
            </h2>

            {loading ? (
                <div className={styles.loadingGif}>
                    <img src="/public/three-11928_256.gif" alt="loading" />
                </div>
            ) : (
                connection ? (
                    <div className={styles.connectionDetails}>
                        <p>Die Reise dauert <strong>{convertDurationToMinutes(connection.duration)}</strong> Minuten
                            (<i>Laufzeit mit eingerechnet</i>)</p>
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
                    <p>Es gibt keine Reise nach {city}</p>
                )
            )}
        </div>
    );
}

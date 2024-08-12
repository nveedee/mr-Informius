import { useEffect, useState } from "react";
import styles from '../styles/sbb.module.css';

const SBB_REFRESH_INTERVAL = 60 * 1000; // 1 Minute in Millisekunden

type Station ={
    name: string;
}

type Stop ={
    station: Station;
    platform: string;
    departure: string;
}

type PassListEntry = {
    station: Station;
    arrival: string;
}

type StationboardEntry = {
    stop: Stop;
    to: string;
    category: string;
    number: string;
    passList: PassListEntry[];
}

export default function SbbApi() {
    const [stationboard, setStationboard] = useState<StationboardEntry[]>([]);

    const fetchStationboard = () => {
        fetch("https://transport.opendata.ch/v1/stationboard?station=Winterthur&limit=9")
            .then(res => res.json())
            .then(data => {
                setStationboard(data.stationboard || []);
                console.log(data);
            })
            .catch(error => console.error('Error fetching connections:', error));
    };

    useEffect(() => {
        fetchStationboard();

        const intervalId = setInterval(fetchStationboard, SBB_REFRESH_INTERVAL);

        return () => clearInterval(intervalId);
    }, []);

    const roundToNextMinute = (date: Date): Date => {
        let newDate = new Date(date);
        newDate.setSeconds(0, 0);
        if (date.getSeconds() >= 30) {
            newDate.setMinutes(newDate.getMinutes() + 1);
        }
        return newDate;
    };

    const formatTimeWithoutSeconds = (date: Date): string => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    return (
        <div className={styles.stationContainer}>
            <h2 className={styles.cardTitle}>SBB Fahrplan</h2>
            <table className={styles.styledTable}>
                <thead>
                <tr>
                    <th>Von</th>
                    <th>Abfahrtszeit</th>
                    <th>Gleis</th>
                    <th>Nach</th>
                    <th>Ankunftszeit</th>
                    <th>Name</th>
                </tr>
                </thead>
                <tbody>
                {stationboard.map((item, idx) => {
                    const arrivalTime = item.passList.find(
                        p => p.station.name === item.to
                    )?.arrival;
                    const platform = item.stop.platform.replace(/!/g, '');

                    return (
                        <tr key={idx}>
                            <td>{item.stop.station.name}</td>
                            <td>{formatTimeWithoutSeconds(roundToNextMinute(new Date(item.stop.departure)))}</td>
                            <td>{platform}</td>
                            <td>{item.to}</td>
                            <td>{arrivalTime ? formatTimeWithoutSeconds(roundToNextMinute(new Date(arrivalTime))) : 'N/A'}</td>
                            <td>{item.category + item.number}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}

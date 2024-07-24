import { useEffect, useState } from "react";
import styles from '../styles/sbb.module.css';

// Initialer Token-Wert
const INITIAL_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJsZWFkZXJib2FyZCIsImlhdCI6MTcyMTgwOTExMSwiZXhwIjoxNzIxODk1NTExfQ.Lh-roYWhL-Grz87gCysBSBjNyXp--OfzVpjh-Z47HRU';
const AUTH_URL = 'http://192.168.100.16:8080/api/auth/authenticate';
const TOKEN_REFRESH_INTERVAL = 12 * 60 * 60 * 1000; // 12 Stunden in Millisekunden

export default function SbbApi() {
    const [stationboard, setStationboard] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [showHelloWorld, setShowHelloWorld] = useState(false);
    const [apiToken, setApiToken] = useState(INITIAL_TOKEN);

    // Fetch für die Stationboard-Daten
    useEffect(() => {
        fetch("https://transport.opendata.ch/v1/stationboard?station=Winterthur&limit=7")
            .then(res => res.json())
            .then(data => setStationboard(data.stationboard || []))
            .catch(error => console.error('Error fetching connections:', error));
    }, []);

    // Fetch für die Leaderboard-Daten
    useEffect(() => {
        fetch("http://192.168.100.16:8080/api/trainees/leaderboard", {
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {

                const sortedLeaderboard = data.sort((a, b) => b.points - a.points);
                setLeaderboard(sortedLeaderboard);
            })
            .catch(error => console.error('Error fetching leaderboard:', error));
    }, [apiToken]);


    const updateToken = () => {
        fetch(AUTH_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'leaderboard',
                password: 'leaderboard'
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.token) {
                    setApiToken(data.token);
                } else {
                    console.error('Error fetching new token');
                }
            })
            .catch(error => console.error('Error updating token:', error));
    };

    useEffect(() => {

        updateToken();


        const intervalId = setInterval(updateToken, TOKEN_REFRESH_INTERVAL);


        return () => clearInterval(intervalId);
    }, []);


    useEffect(() => {
        const intervalId = setInterval(() => {
            setShowHelloWorld(prev => !prev);
        }, 15000);


        return () => clearInterval(intervalId);
    }, []);

    const roundToNextMinute = (date) => {
        let newDate = new Date(date);
        newDate.setSeconds(0, 0);
        if (date.getSeconds() >= 30) {
            newDate.setMinutes(newDate.getMinutes() + 1);
        }
        return newDate;
    };

    const formatTimeWithoutSeconds = (date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const renderStationboardCard = () => (
        <div
            className={styles.stationContainer}
            onClick={() => setShowHelloWorld(true)}
            style={{ cursor: 'pointer' }}
        >
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

    const renderLeaderboardCard = () => {
        return (
            <div
                className={styles.helloWorldContainer}
                onClick={() => setShowHelloWorld(false)}
            >
                <h2 className={styles.cardTitleHelloWorld}>AXA Coins Leaderboard</h2>
                <ul className={styles.rankingsList}>
                    {leaderboard.map((item, idx) => (
                        <li key={idx} className={styles.rankingsItem}>
                            {idx + 1}. {item.username} - {item.points.toFixed(0)} Coins
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <div className={styles.connectionInput}>
            <div className={styles.container}>
                {showHelloWorld ? renderLeaderboardCard() : renderStationboardCard()}
            </div>
        </div>
    );
}

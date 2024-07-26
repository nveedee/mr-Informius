import { useEffect, useState } from "react";
import styles from '../styles/sbb.module.css';

// Initialer Token-Wert
const INITIAL_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJsZWFkZXJib2FyZCIsImlhdCI6MTcyMTgwOTExMSwiZXhwIjoxNzIxODk1NTExfQ.Lh-roYWhL-Grz87gCysBSBjNyXp--OfzVpjh-Z47HRU';
const AUTH_URL = 'http://192.168.100.16:8080/api/auth/authenticate';
const TOKEN_REFRESH_INTERVAL = 12 * 60 * 60 * 1000; // 12 Stunden in Millisekunden
const SBB_REFRESH_INTERVAL = 60 * 1000; // 1 Minute in Millisekunden

// Liste der Motivationssprüche
const MOTIVATION_QUOTES = [
    {
        text: "Die einzige Limitierung ist die, die du dir selbst setzt.",
        author: "Travis Scott",
        description: "Travis Scott, ein US-amerikanischer Rapper und Produzent, ist bekannt für seine innovativen musikalischen Projekte und seine prägende Rolle in der modernen Hip-Hop-Szene."
    },
    {
        text: "Hör nie auf, an dich selbst zu glauben, selbst wenn es niemand sonst tut.",
        author: "Kanye West",
        description: "Kanye West ist ein amerikanischer Rapper, Produzent und Modedesigner, bekannt für seine kreative Vision und seine Beiträge zur Musik- und Modewelt."
    },
    {
        text: "Glaube an deine Träume, auch wenn die ganze Welt dagegen ist.",
        author: "J. Cole",
        description: "J. Cole ist ein US-amerikanischer Rapper und Produzent, der für seine introspektiven Texte und seine ehrliche Musik bekannt ist."
    },
    {
        text: "Erfolg ist nicht nur, was du erreichst, sondern auch, was du überwindest.",
        author: "Drake",
        description: "Drake, ein kanadischer Rapper und Sänger, ist für seine Vielseitigkeit und seinen Einfluss auf die moderne Musiklandschaft bekannt."
    },
    {
        text: "Dein größter Feind ist die Angst vor dem Scheitern.",
        author: "Eminem",
        description: "Eminem, ein amerikanischer Rapper und Songwriter, ist bekannt für seine ehrlichen und oft kontroversen Texte sowie seinen Einfluss auf das Genre des Hip-Hop."
    }
];

export default function SbbApi() {
    const [stationboard, setStationboard] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [currentCard, setCurrentCard] = useState('stationboard'); // Zustand, um die aktuelle Karte zu steuern
    const [apiToken, setApiToken] = useState(INITIAL_TOKEN);
    const [motivation, setMotivation] = useState({ text: "", author: "", description: "" });

    const fetchStationboard = () => {
        fetch("https://transport.opendata.ch/v1/stationboard?station=Winterthur&limit=7")
            .then(res => res.json())
            .then(data => setStationboard(data.stationboard || []))
            .catch(error => console.error('Error fetching connections:', error));
    };

    // Fetch für die Stationboard-Daten
    useEffect(() => {
        fetchStationboard();

        const intervalId = setInterval(fetchStationboard, SBB_REFRESH_INTERVAL);

        // Aufräumen beim Unmounten des Components
        return () => clearInterval(intervalId);
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

    // Wähle einen Motivationsspruch basierend auf dem aktuellen Datum
    useEffect(() => {
        const today = new Date();
        const index = today.getDate() % MOTIVATION_QUOTES.length; // Wechselt jeden Tag
        setMotivation(MOTIVATION_QUOTES[index]);
    }, []);

    // Wechsel die Karte alle 15 Sekunden
    useEffect(() => {
        const cards = ['stationboard', 'leaderboard', 'motivation'];
        let currentIndex = cards.indexOf(currentCard);

        const intervalId = setInterval(() => {
            currentIndex = (currentIndex + 1) % cards.length;
            setCurrentCard(cards[currentIndex]);
        }, 15000); // 15 Sekunden

        return () => clearInterval(intervalId);
    }, [currentCard]);

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
            onClick={() => setCurrentCard('leaderboard')}
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

    const renderLeaderboardCard = () => (
        <div
            className={styles.leaderBoardContainer}
            onClick={() => setCurrentCard('motivation')}
        >
            <h2 className={styles.cardtitleLeaderboard}>AXA Coins Leaderboard</h2>
            <ul className={styles.rankingsList}>
                {leaderboard.map((item, idx) => (
                    <li key={idx} className={styles.rankingsItem}>
                        {idx + 1}. {item.username} - {item.points.toFixed(0)} Coins
                    </li>
                ))}
            </ul>
        </div>
    );

    const renderMotivationCard = () => (
        <div
            className={styles.motivationCard}
            onClick={() => setCurrentCard('stationboard')}
        >
            <h2 className={styles.cardTitleMotivation}>Motivationsspruch des Tages</h2>
            <blockquote className={styles.motivationText}>
                "{motivation.text}"
            </blockquote>
            <footer className={styles.motivationAuthor}>
                - {motivation.author}
            </footer>
            <p className={styles.motivationDescription}>
                {motivation.description}
            </p>
        </div>
    );

    return (
        <div className={styles.connectionInput}>
            <div className={styles.container}>
                {currentCard === 'stationboard' && renderStationboardCard()}
                {currentCard === 'leaderboard' && renderLeaderboardCard()}
                {currentCard === 'motivation' && renderMotivationCard()}
            </div>
        </div>
    );
}

import styles from "../styles/sbb.module.css";
import {useEffect, useState} from "react";

// Initialer Token-Wert
const INITIAL_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJsZWFkZXJib2FyZCIsImlhdCI6MTcyMTgwOTExMSwiZXhwIjoxNzIxODk1NTExfQ.Lh-roYWhL-Grz87gCysBSBjNyXp--OfzVpjh-Z47HRU';
const AUTH_URL = 'http://192.168.100.16:8080/api/auth/authenticate';
const TOKEN_REFRESH_INTERVAL = 12 * 60 * 60 * 1000; // 12 Stunden in Millisekunden

type LeaderboardData = {
    username: string;
    points: number;
};

type AuthResponse = {
    token: string;
};

export default function AxaCoin() {
    const [apiToken, setApiToken] = useState<string>(INITIAL_TOKEN);
    const [leaderboard, setLeaderboard] = useState<LeaderboardData[]>([]);

    // Fetch für die Leaderboard-Daten
    useEffect(() => {
        const fetchLeaderboard = async () => {

            const response = await fetch("http://192.168.100.16:8080/api/trainees/leaderboard", {
                headers: {
                    'Authorization': `Bearer ${apiToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error fetching leaderboard: ${response.statusText}`);
            }

            const data: LeaderboardData[] = await response.json();
            const sortedLeaderboard = data.sort((a, b) => b.points - a.points);
            setLeaderboard(sortedLeaderboard);

        };

        fetchLeaderboard();
    }, [apiToken]);

    const updateToken = async () => {

        const response = await fetch(AUTH_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: 'leaderboard',
                password: 'leaderboard',
            }),
        });

        if (!response.ok) {
            throw new Error(`Error fetching new token: ${response.statusText}`);
        }

        const data: AuthResponse = await response.json();

        if (data.token) {
            setApiToken(data.token);
        } else {
            console.error('Token not found in response');

        }
    };

    useEffect(() => {
        updateToken();

        const intervalId = setInterval(updateToken, TOKEN_REFRESH_INTERVAL);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className={styles.leaderBoardContainer}>
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
}

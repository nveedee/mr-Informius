import { useEffect, useState } from "react";
import styles from "../styles/sbb.module.css";

const MOTIVATION_QUOTES = [
    {
        quote: "Die einzige Limitierung ist die, die du dir selbst setzt.",
        author: "Travis Scott",
        category: "Travis Scott, ein US-amerikanischer Rapper und Produzent, ist bekannt für seine innovativen musikalischen Projekte und seine prägende Rolle in der modernen Hip-Hop-Szene."
    },
    {
        quote: "Glaube an deine Träume, auch wenn die ganze Welt dagegen ist.",
        author: "J. Cole",
        category: "J. Cole ist ein US-amerikanischer Rapper und Produzent, der für seine introspektiven Texte und seine ehrliche Musik bekannt ist."
    },
    {
        quote: "Erfolg ist nicht nur, was du erreichst, sondern auch, was du überwindest.",
        author: "Drake",
        category: "Drake, ein kanadischer Rapper und Sänger, ist für seine Vielseitigkeit und seinen Einfluss auf die moderne Musiklandschaft bekannt."
    },
    {
        quote: "Dein größter Feind ist die Angst vor dem Scheitern.",
        author: "Eminem",
        category: "Eminem, ein amerikanischer Rapper und Songwriter, ist bekannt für seine ehrlichen und oft kontroversen Texte sowie seinen Einfluss auf das Genre des Hip-Hop."
    }
];

type Quote = {
    quote: string;
    author: string;
    category?: string;
};

export default function Quotes() {
    const [motivation, setMotivation] = useState<Quote>();
    const [lastFetchTime, setLastFetchTime] = useState<number>(0);

    function getQuote() {
        fetch("https://api.api-ninjas.com/v1/quotes", {
            headers: { "x-api-key": "ql3uI+G2eMYRt8oeElKvKQ==EbCtcxpiBPrpIGWl" }
        })
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const apiQuote: Quote = {
                        quote: data[0].quote,
                        author: data[0].author,
                        category: data[0].category // Use this if the API provides a category field
                    };
                    setMotivation(apiQuote);
                    setLastFetchTime(Date.now()); // Store the time of the fetch
                }
            })
            .catch(error => {
                console.error("Error fetching quotes:", error);
                setMotivation(MOTIVATION_QUOTES[1]); // Fallback quote
            });
    }

    useEffect(() => {
        const currentTime = Date.now();
        const oneHour = 3600000; // 1 hour in milliseconds

        if (currentTime - lastFetchTime >= oneHour) {
            getQuote(); // Fetch a new quote if more than an hour has passed since the last fetch
        }
    }, [lastFetchTime]);

    return (
        <div className={styles.motivationCard}>
            <h2 className={styles.cardTitleMotivation}>Quote der Stunde</h2>
            <blockquote className={styles.motivationText}>
                "{motivation?.quote}"
            </blockquote>
            <footer className={styles.motivationAuthor}>
                - {motivation?.author}
            </footer>
            {motivation?.category && (
                <p className={styles.motivationDescription}>
                   topic: {motivation.category}
                </p>
            )}
        </div>
    );
}

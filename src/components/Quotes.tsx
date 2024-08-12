import {useEffect, useState} from "react";
import styles from "../styles/sbb.module.css";

const MOTIVATION_QUOTES = [
    {
        text: "Die einzige Limitierung ist die, die du dir selbst setzt.",
        author: "Travis Scott",
        description: "Travis Scott, ein US-amerikanischer Rapper und Produzent, ist bekannt für seine innovativen musikalischen Projekte und seine prägende Rolle in der modernen Hip-Hop-Szene."
    },
    {
        text: "Je grösser das Schoggibrot, desto besser wird der Tag",
        author: "Elias Zulauf",
        description: "Motivierter und konzentrieter Lehrling aus dem Jahrgang 2023"
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

export default function Quotes(){
    const [motivation, setMotivation] = useState({ text: "", author: "", description: "" });

    useEffect(() => {
        const today = new Date();
        const index = today.getDate() % MOTIVATION_QUOTES.length; // Wechselt jeden Tag
        setMotivation(MOTIVATION_QUOTES[index]);
    }, []);

    return(
        <>
            <div className={styles.motivationCard}>

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

        </>
    )
}
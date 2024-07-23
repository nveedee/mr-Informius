import React from 'react';
import { Calendar } from 'antd';
import moment from 'moment';
import styles from '../styles/calendar.module.css'; // Importiere das Stylesheet

// Beispiel-Daten für den Kalender
const events = [
    { date: '2024-07-22', content: 'Meeting mit dem Team' },
    { date: '2024-07-25', content: 'Projekt-Deadline' },
    { date: '2024-07-30', content: 'ddd' },
];

const dateCellRender = (value) => {
    const formattedDate = value.format('YYYY-MM-DD');
    const event = events.find(event => event.date === formattedDate);
    return event ? <div className={styles.event}>{event.content}</div> : null;
};

const MyCalendar = () => {
    return (
        <div>
            <h2>Kalender</h2>
            <Calendar dateCellRender={dateCellRender} />
        </div>
    );
};

export default MyCalendar;

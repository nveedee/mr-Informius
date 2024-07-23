import React, { useState } from 'react';
import { Calendar, Modal } from 'antd';
import moment from 'moment';
import styles from '../styles/calendar.module.css'; // Importiere das Stylesheet

// Beispiel-Daten für den Kalender
const events = [
    { date: '2024-07-22', content: 'Meeting mit dem Team', description: 'Besprechung zur Projektkoordination' },
    { date: '2024-07-25', content: 'Projekt-Deadline', description: 'Abgabe des Projektberichts' },
    { date: '2024-07-30', content: 'ddd', description: 'Weitere Details für diesen Tag' },
];

const dateCellRender = (value) => {
    const formattedDate = value.format('YYYY-MM-DD');
    const event = events.find(event => event.date === formattedDate);
    return event ? <div className={styles.event} onClick={() => handleEventClick(event)}>{event.content}</div> : null;
};

const handleEventClick = (event) => {
    Modal.info({
        title: event.content,
        content: (
            <div>
                <p>{event.description}</p>
            </div>
        ),
        onOk() {},
    });
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

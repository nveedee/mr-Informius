import React, { useState } from 'react';
import { Calendar, Modal } from 'antd';
import moment from 'moment';
import styles from '../styles/calendar.module.css'; // Importiere das Stylesheet

// Beispiel-Daten für den Kalender mit Ereignissen, die mehrere Tage umfassen
const events = [
    { startDate: '2024-07-15', endDate: '2024-07-19', content: 'Da Vinci Projekt', description: 'Projektarbeit für Da Vinci - letzte Woche', color: '#ff9999' },
    { startDate: '2024-07-22', endDate: '2024-07-26', content: 'Da Vinci Projekt', description: 'Projektarbeit für Da Vinci - diese Woche', color: '#99ff99' },
    { startDate: '2024-07-29', endDate: '2024-08-18', content: '3 Wochen Urlaub', description: 'Urlaub für 3 Wochen', color: '#9999ff' },
    { startDate: '2024-08-19', endDate: '2024-08-19', content: 'Da Vinci Vorstellung', description: 'Vorstellung des Da Vinci Projekts', color: '#ffcc99' },
];


// Überprüft, ob das gegebene Datum innerhalb des Ereigniszeitraums liegt
const isDateInRange = (date, startDate, endDate) => {
    return moment(date).isSameOrAfter(startDate) && moment(date).isSameOrBefore(endDate);
};

const dateCellRender = (value) => {
    const formattedDate = value.format('YYYY-MM-DD');
    const event = events.find(event => isDateInRange(formattedDate, event.startDate, event.endDate));
    return event ? (
        <div
            className={styles.event}
            onClick={() => handleEventClick(event)}
            style={{ backgroundColor: event.color }} // Setze die Hintergrundfarbe für das Event
        >
            {event.content}
        </div>
    ) : null;
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
        <div className={styles.calendarCard}>
            <h2>Kalender</h2>
            <Calendar dateCellRender={dateCellRender} />
        </div>
    );
};

export default MyCalendar;

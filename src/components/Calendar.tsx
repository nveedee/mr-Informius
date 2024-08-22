import { useEffect, useState } from 'react';
import { Calendar, Modal, ConfigProvider } from 'antd';
import moment from 'moment';
import 'moment/locale/de';
import * as ical from 'ical';
import styles from '../styles/calendar.module.css';
import en_GB from 'antd/lib/locale/de_DE';

type Event = {
    startDate: string;
    endDate: string;
    content: string;
    description: string;
    color: string;
};

function MyCalendar() {
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        fetch('/Calendar.ics')
            .then(response => response.text())
            .then(data => {
                const parsedEvents = parseIcsData(data) ;
                setEvents(parsedEvents);
            })
            .catch(error => console.error('Error fetching the ICS file:', error));
    }, []);

    const parseIcsData = (data: string): Event[] => {
        const parsedData = ical.parseICS(data);
        const events: Event[] = [];

        Object.values(parsedData).forEach((event: any) => {
            if (event.type === 'VEVENT') {
                const startDate = formatDate(event.start);
                const endDate = formatDate(event.end);

                let content = event.summary || 'No Content';
                if (typeof content === 'object' && content.val) {
                    content = content.val;
                }

                const description = event.description || 'No Description';
                const color = generateColorForEvent(content);

                events.push({
                    startDate,
                    endDate,
                    content,
                    description,
                    color,
                });
            }
        });

        return events;
    };

    const formatDate = (date: Date | string): string => {
        return moment(new Date(date)).format('YYYY-MM-DD');
    };


    const generateColorForEvent = (content: string): string => {
        if (typeof content !== 'string') {
            console.warn('Event content is not a string:', content);
            content = 'No Content'; // Provide a default value
        }

        if (content.includes('Schule')) {
            return '#ff9999';
        } else if (content.includes('Ferien')) {
            return '#9999ff';
        } else if (content.includes('Kurs')) {
            return '#ffcc99';
        } else {
            return '#99ff99';
        }
    };

    const isDateInRange = (date: string, startDate: string, endDate: string): boolean => {
        // Convert endDate to a moment object and subtract 1 day
        const adjustedEndDate = moment(endDate).subtract(1, 'day');

        // Check if the date is between startDate and adjustedEndDate
        return moment(date).isBetween(startDate, adjustedEndDate, null, '[]');
    };

    const dateCellRender = (value: moment.Moment) => {
        const formattedDate = value.format('YYYY-MM-DD');
        const eventsForDate = events.filter(event => isDateInRange(formattedDate, event.startDate, event.endDate));

        return eventsForDate.length > 0 ? (
            <div className={styles.eventList}>
                {eventsForDate.map((event, index) => (
                    <div
                        key={index}
                        className={styles.event}
                        onClick={() => handleEventClick(event)}
                        style={{ backgroundColor: event.color }}
                    >
                        {event.content}
                    </div>
                ))}
            </div>
        ) : null;
    };

    const handleEventClick = (event: Event) => {
        Modal.info({
            title: event.content,
            content: (
                <div>
                    <p>{event.description}</p>
                    <p>
                        {event.startDate} &rarr; {moment(event.endDate).subtract(1, 'day').format('YYYY-MM-DD')}
                    </p>

                </div>
            ),
            onOk() {
            },
        });
    };

    return (
        <ConfigProvider locale={en_GB}>
            <div className={styles.calendarCard}>
                <Calendar cellRender={dateCellRender} />
            </div>
        </ConfigProvider>
    );
}

export default MyCalendar;
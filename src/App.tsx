import { useState, useEffect } from 'react';
import './App.css';
import Card from "./components/Card";
import Calendar from "./components/Calendar";
import SbbApi from "./components/SbbApi";
import Uhr from "./components/Uhr";
import Weather from "./components/Weather";

function App() {
    const [isClicked, setIsClicked] = useState<boolean>(true);
    const [backgroundClass, setBackgroundClass] = useState('day-background');

    // Function to toggle the state on double click
    function buttonHandler() {
        setIsClicked(!isClicked);
    }

    // Effect to update the background class based on time of day
    useEffect(() => {
        const updateBackground = () => {
            const hours = new Date().getHours();
            if (hours >= 6 && hours < 9) {
                setBackgroundClass('morning-background');
            } else if (hours >= 9 && hours < 12) {
                setBackgroundClass('noon-background');
            } else if (hours >= 12 && hours < 17) {
                setBackgroundClass('afternoon-background');
            } else {
                setBackgroundClass('evening-background');
            }
        };

        updateBackground(); // Set the initial background
        const interval = setInterval(updateBackground, 60000); // Update every minute

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    return (
        <div className={`pageContainer ${backgroundClass}`}>
            <div className={"cardContainer"}>
                <div>
                    <div className={"miniCard"}>
                        <Card>
                            <Uhr />
                        </Card>
                        <Card>
                            <Weather />
                        </Card>
                    </div>

                    <Card>
                        <SbbApi />
                    </Card>
                </div>

                <Card onDoubleClick={buttonHandler}>
                    <div>
                        {isClicked ? (
                            <div className={"calendarCard"}>
                                <Calendar />
                                <img src="../public/icons8-double-click-24.png" alt="png" />
                                <p>Double click</p>
                            </div>
                        ) : (
                            <iframe
                                width="1000rem"
                                height="1000rem"
                                name="iframe-field_venue_iframe-232"
                                id="iframe-field_venue_iframe-232"
                                title=""
                                allow="accelerometer;autoplay;camera;encrypted-media;geolocation;gyroscope;microphone;payment;picture-in-picture"
                                src="https://data.zfv.ch/de/menus/plan/restaurant-axa-superblock"
                            >
                                Your browser does not support iframes, but you can visit <a
                                href="https://data.zfv.ch/de/menus/plan/restaurant-axa-superblock"></a>
                            </iframe>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default App;
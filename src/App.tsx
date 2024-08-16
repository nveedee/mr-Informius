import {useEffect, useState} from 'react';
import './App.css';
import Card from "./components/Card";
import Calendar from "./components/Calendar";
import SbbApi from "./components/SbbApi";
import Uhr from "./components/Uhr";
import Weather from "./components/Weather";
import Quotes from "./components/Quotes.tsx";
import AxaCoin from "./components/AxaCoin.tsx";


function App() {
    const [isClicked, setIsClicked] = useState<boolean>(true);
    const [middleCard, setMiddleCard] = useState<number>(2);
    const [backgroundClass, setBackgroundClass] = useState('day-background');


    // Function to toggle the state on double click
    function buttonHandler() {
        setIsClicked(!isClicked);
    }

    function changecard() {
        if (middleCard === 3) {
            setMiddleCard(1);
        } else {
            setMiddleCard(middleCard + 1);
        }
    }

    useEffect(() => {
        const updateBackground = () => {
            const hours = new Date().getHours();
            if (hours >= 18 && hours < 6) {
                setBackgroundClass('night-background');
            } else if (hours >= 6 && hours < 18) {
                setBackgroundClass('day-background');
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
                        <Card><Uhr/></Card>
                        <Card><Weather/></Card>
                    </div>

                    <Card onDoubleClick={changecard} className={"middle-card"}>
                        {middleCard === 1 && <SbbApi/>}
                        {middleCard === 2 && <Quotes/>}
                        {middleCard === 3 && <AxaCoin/>}
                    </Card>
                </div>
                <div className={"card-right"}>
                    <Card onDoubleClick={buttonHandler}>
                        <div>
                            {isClicked ? (
                                <div className={"calendarCard"}>
                                    <h1>Kalender</h1>
                                    <Calendar/>

                                </div>
                            ) : (
                                <div className={"calendarCard"}>
                                    <h1>Menüplan</h1>
                                    <iframe onDoubleClick={buttonHandler} width="1000vh" height="1000rem"
                                            name="iframe-field_venue_iframe-232"
                                            id="iframe-field_venue_iframe-232"
                                            allow="accelerometer;autoplay;camera;encrypted-media;geolocation;gyroscope;microphone;payment;picture-in-picture"
                                            src="https://data.zfv.ch/de/menus/plan/restaurant-axa-superblock">
                                        Your browser does not support iframes, but you can visit <a
                                        href="https://data.zfv.ch/de/menus/plan/restaurant-axa-superblock"></a>
                                    </iframe>

                                </div>
                            )}
                        </div>
                    </Card>

                </div>
            </div>
        </div>
    );
}

export default App;



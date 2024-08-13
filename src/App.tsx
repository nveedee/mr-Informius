import {useEffect, useState} from 'react';
import './App.css';
import Card from "./components/Card";
import Calendar from "./components/Calendar";
import SbbApi from "./components/SbbApi";
import Uhr from "./components/Uhr";
import Weather from "./components/Weather";
import Keyboard from "./components/Keyboard.tsx";
import Quotes from "./components/Quotes.tsx";
import AxaCoin from "./components/AxaCoin.tsx";

type personData = {
    id: string
    userName : string
}

function App() {
    const [isClicked, setIsClicked] = useState<boolean>(true);
    const [middleCard, setMiddleCard] = useState<number>(1);
    const [login, setlogin] = useState<boolean>(false);
    const [backgroundClass, setBackgroundClass] = useState('day-background');
    const [id, setid] = useState<string>("");
    const [currentId, setCurrentid] = useState<string>("");
    const [currenData, setCurrentData] = useState<personData>();


    // Use useEffect to add event listener once
    useEffect(() => {
        const handleKeypress = (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                setlogin(true)
                fetch("http://localhost:8080/api/persons",
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({id})
                    }
                )
                    .then(response => response.json())
                    .then(data => console.log('Success:', data))
                    .catch((error) => console.error('Error:', error));
                setCurrentid(id)
                setid("")
            } else {
                setid(prevuid => prevuid + event.key);
                setlogin(false)
            }
        };

        // Add event listener
        window.addEventListener("keypress", handleKeypress);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener("keypress", handleKeypress);
        };
    }, [id]);

    // Function to toggle the state on double click
    function buttonHandler() {
        setIsClicked(!isClicked);
    }

    function changecard() {
        console.log(middleCard)
        if (middleCard === 3) {
            setMiddleCard(1)
        } else {
            setMiddleCard(middleCard + 1)
        }
    }

    // Effect to update the background class based on time of day
    useEffect(() => {
        const updateBackground = () => {
            const hours = new Date().getHours();
            if (hours >= 21 || hours < 9) {
                setBackgroundClass('night-background');
            } else {
                setBackgroundClass('day-background');
            }
        };

        updateBackground(); // Set the initial background
        const interval = setInterval(updateBackground, 60000); // Update every minute

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    useEffect(() => {
       fetchPersonData()
    }, [currentId]);

    function fetchPersonData(){
        fetch(`http://localhost:8080/api/persons/${currentId}`)
            .then(response => response.json())
            .then(data => setCurrentData(data))
            .catch((error) => console.error('Error:', error));
    }

    return (
        <div className={`pageContainer ${backgroundClass}`}>
            {login ? (
                <div className={"Nameinput"}>
                    <h3>Dein Name</h3>
                    <h6><i>Mit diesem Namen werden deine Kollegen dich sehen</i></h6>
                    <Keyboard id={currentId} onSubmit={() => {setlogin(false); fetchPersonData()}}/>
                </div>
            ) : (
                <>
                    {currentId && (
                        <header>
                            <h1>Guten Nachmittag, {currenData?.userName}</h1>
                            <div>
                                <button>Settings</button>
                                <button onClick={() => setCurrentid("")}>abmelden</button>
                            </div>
                        </header>
                    )}

                    <div className={"cardContainer"}>
                        <div>
                            <div className={"miniCard"}>
                                <Card>
                                    <Uhr/>
                                </Card>
                                <Card>
                                    <Weather/>
                                </Card>
                            </div>

                            <Card onClick={changecard}>
                                {middleCard === 1 && <SbbApi/>}
                                {middleCard === 2 && <Quotes/>}
                                {middleCard === 3 && <AxaCoin/>}
                            </Card>
                        </div>

                        <Card onDoubleClick={buttonHandler}>
                            <div>
                                {isClicked ? (
                                    <div className={"calendarCard"}>
                                        <Calendar/>
                                        <img src="../public/icons8-double-click-24.png" alt="png"/>
                                        <p>Double click</p>
                                    </div>
                                ) : (
                                    <div className={"calendarCard"}>
                                        <iframe onDoubleClick={buttonHandler} width="1000vh" height="970rem"
                                                name="iframe-field_venue_iframe-232"
                                                id="iframe-field_venue_iframe-232"
                                                allow="accelerometer;autoplay;camera;encrypted-media;geolocation;gyroscope;microphone;payment;picture-in-picture"
                                                src="https://data.zfv.ch/de/menus/plan/restaurant-axa-superblock">
                                            Your browser does not support iframes, but you can visit <a
                                            href="https://data.zfv.ch/de/menus/plan/restaurant-axa-superblock"></a>
                                        </iframe>
                                        <img className={"doubleclick"} src="../public/icons8-double-click-24.png"
                                             alt="png"/>
                                        <p>Double click</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
}

export default App;

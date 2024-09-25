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
import TakeMeHome from "./components/TakeMeHome.tsx";

type personData = {
    id: string
    userName: string
    location: string
}


function App() {
    const [isClicked, setIsClicked] = useState<boolean>(true);
    const [middleCard, setMiddleCard] = useState<number>(1);
    const [login, setlogin] = useState<boolean>(false);
    const [backgroundClass, setBackgroundClass] = useState('day-background');
    const [id, setid] = useState<string>("");
    const [currentId, setCurrentid] = useState<string>("");
    const [currenData, setCurrentData] = useState<personData| null>(null);
    const [dayTime, setDayTime] = useState<string>("Morgen");
    const [prevId, setPrevId] = useState<string>("")

    // Use useEffect to add event listener once
    useEffect(() => {
        const handleKeypress = (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                setCurrentData(null)

                fetch(`http://localhost:8080/api/persons/${id}`,
                )
                    .then(response => response.json())
                    .then(data => {
                        console.log(data)
                        setCurrentid(id)
                        setCurrentData(data)
                    })
                    .catch(error => {
                        if (error.message === 'Failed to fetch') {
                            alert("Backend is Offline"); // Network errors like server being offline
                        } else {
                            console.error(error); // Log other types of errors
                            setlogin(true)
                            setCurrentid(id)
                        }
                    });
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
        if (middleCard === 3) {
            setMiddleCard(1);
        } else {
            setMiddleCard(middleCard + 1);
        }
    }

    useEffect(() => {
        const updateBackground = () => {
            const hours = new Date().getHours();
            if (hours >= 18 && hours < 24) {
                setBackgroundClass('day-background');
                setDayTime("Abend");
            } else if (hours >= 12 && hours < 18) {
                setBackgroundClass('day-background');
                setDayTime("Nachmittag");
            } else if (hours >= 0 && hours < 12) {
                setBackgroundClass('day-background');
                setDayTime("Morgen");
            }
        };

        updateBackground(); // Set the initial background
        const interval = setInterval(updateBackground, 60000); // Update every minute

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    useEffect(() => {
        if (currentId) { // TODO: Ron Fehler Error beheben
            setPrevId(currentId);
            if (prevId != currentId) {
                fetchPersonData();
            }
        }
    }, [currentId]);

    function fetchPersonData() {
        fetch(`http://localhost:8080/api/persons/${currentId}`)
            .then(response => response.json())
            .then(data => setCurrentData(data))
            .catch((error) => console.error('Error:', error));
    }

    return (
        <div className={`pageContainer ${backgroundClass}`}>
            {login ? (
                <div className={"Nameinput"}>
                    <h3>Deine persönlichen Angaben</h3>
                    <h6><i>Du kannst deine Angaben später noch ändern</i></h6>
                    <Keyboard id={currentId} onSubmit={() => {
                        setlogin(false);
                        fetchPersonData()
                    }} llocation={currenData?.location || ""} username={currenData?.userName || ""}/>
                </div>
            ) : (
                <>
                    {currentId && (
                        <header>
                            <h1>Guten {dayTime}, {currenData?.userName}</h1>
                            <div>
                                <button onClick={() => setlogin(true)}>Daten ändern</button>
                                <button onClick={() => {setCurrentid(""); setCurrentData(null)}}>abmelden</button>
                            </div>
                        </header>
                    )}

                    <div className={"cardContainer"}>

                        <div>
                            <div className={"miniCard"}>
                                <Card><Uhr/></Card>
                                <Card><Weather/></Card>
                            </div>

                            <Card onClick={changecard} className={"middle-card"}>
                                {middleCard === 1 && (
                                    currentId ? (
                                        currenData ? (
                                            <TakeMeHome city={currenData.location} />
                                        ) : (
                                            <div>Loading...</div> // Optional: A loading indicator while currenData is undefined
                                        )
                                    ) : (
                                        <SbbApi />
                                    )
                                )}
                                {middleCard === 2 && <Quotes />}
                                {middleCard === 3 && <AxaCoin />}
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
                                        <iframe
                                            width="850vh"
                                            height="900rem"
                                            name="iframe-field_venue_iframe-232"
                                            id="iframe-field_venue_iframe-232"
                                            title=""
                                            sandbox="allow-scripts allow-same-origin"
                                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                            src="https://app.food2050.ch/de/pionier/pionier/menu/mittagsmenue/weekly">
                                            Your browser does not support iframes, but you can visit
                                            <a href="https://app.food2050.ch/de/pionier/pionier/menu/mittagsmenue/weekly"></a>
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

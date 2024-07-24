import './App.css'
import Card from "./components/Card"
import Calendar from "./components/Calendar"
import SbbApi from "./components/SbbApi";
import Uhr from "./components/Uhr.tsx";
import Weather from "./components/Weather.tsx";
import {useState} from "react";

function App() {


    const [isClicked, setIsClicked] = useState<boolean>(true)

    function buttonHandler() {
        if (isClicked) {
            setIsClicked(false)
        } else {
            setIsClicked(true)
        }
    }

    return (
        <body>

        <div className={"pageContainer"}>
            <div className={"cardContainer"}>
                <div>
                    <div className={"miniCard"}>
                        <Card>
                            <Uhr></Uhr>
                        </Card>
                        <Card>
                            <Weather></Weather>
                        </Card>
                    </div>

                    <Card>
                        <SbbApi/>
                    </Card>
                </div>

                <Card onDoubleClick={buttonHandler}>
                    <div>
                        {
                            isClicked ?
                                <div className={"calendarCard"}>
                                    <Calendar></Calendar>
                                    <img src="../public/icons8-double-click-24.png" alt="png"/>
                                    <p>Double click</p>
                                </div>
                                :

                                <iframe width="1000rem" height="1000rem" name="iframe-field_venue_iframe-232"
                                        id="iframe-field_venue_iframe-232" title=""
                                        allow="accelerometer;autoplay;camera;encrypted-media;geolocation;gyroscope;microphone;payment;picture-in-picture"
                                        src="https://data.zfv.ch/de/menus/plan/restaurant-axa-superblock">
                                    Your browser does not support iframes, but you can visit <a
                                    href="https://data.zfv.ch/de/menus/plan/restaurant-axa-superblock"></a>
                                </iframe>
                        }
                    </div>

                </Card>
            </div>
        </div>
        </body>
    )
}

export default App

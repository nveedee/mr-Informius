import './App.css'
import Card from "./components/Card"
import Calendar from "./components/Calendar"
import SbbApi from "./components/SbbApi";
import Uhr from "./components/Uhr.tsx";
import Weather from "./components/Weather.tsx";

function App() {


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
                <iframe width="100%" height="100%" name="iframe-field_venue_iframe-232"
                        id="iframe-field_venue_iframe-232" title=""
                        allow="accelerometer;autoplay;camera;encrypted-media;geolocation;gyroscope;microphone;payment;picture-in-picture"
                        src="https://data.zfv.ch/de/menus/plan/restaurant-axa-superblock">
                    Your browser does not support iframes, but you can visit <a
                    href="https://data.zfv.ch/de/menus/plan/restaurant-axa-superblock"></a>
                </iframe>

                <Card>
                    <Calendar/>
                </Card>
            </div>
        </div>
        </body>
    )
}

export default App

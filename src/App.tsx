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
                        <Card >
                            <Uhr></Uhr>
                        </Card>
                        <Card >
                            <Weather ></Weather>
                        </Card>
                    </div>

                    <Card>
                        <SbbApi/>
                    </Card>
                </div>

                <Card>
                    <Calendar/>
                </Card>
            </div>
        </div>
        </body>
    )
}

export default App

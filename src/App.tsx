import './App.css'
import Card from "./components/Card"
import Calendar from "./components/Calendar"
import SbbApi from "./components/SbbApi";
import Uhr from "./components/Uhr.tsx";

function App() {


    return (
        <body>

        <div className={"pageContainer"}>
            <h1 className={"title"}>Mr. Informius</h1>
            <div className={"cardContainer"}>
                <Card>
                    <Uhr></Uhr>
                </Card>
                <Card>
                    <SbbApi/>
                </Card>

                <Card>
                    <Calendar/>
                </Card>
            </div>
        </div>
        </body>
    )
}

export default App

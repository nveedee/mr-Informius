import './App.css'
import Card from "./components/Card"
import Calendar from "./components/Calendar"
import SbbApi from "./components/SbbApi";

function App() {


  return (
      <body>

      <div className={"pageContainer"}>
          <h1 className={"title"}>Mr. Informius</h1>
          <div className={"cardContainer"}>

              <Card>
                  <SbbApi />
              </Card>
              <Card>
                  <Calendar />
              </Card>
          </div>
      </div>
      </body>
  )
}

export default App

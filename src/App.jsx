import React, {useState} from "react"
import MapComponent from "./components/MapComponent"
import Header from './components/Header'
import ControlPanel from "./components/ControlPanel"

function App() {

  const [mapColor, setMapColor] = useState('')
  const [addedCountry, setAddedCountry] = useState('')

  const getColor = (color) => {
    setMapColor(color)
  }

  const getCountry = (country) => {
    setAddedCountry(country)
  }

  return (
    <div className="app">
      <Header />
      <main>
        <ControlPanel getColorInput={getColor} getAddedCountry={getCountry} />
        <MapComponent selectedColor={mapColor} addedCountry={addedCountry} />
      </main>
    </div>
  )
}

export default App

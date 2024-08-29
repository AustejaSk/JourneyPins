import React, {useState, useEffect} from "react"
import MapComponent from "./components/MapComponent"
import Header from './components/Header'
import ControlPanel from "./components/ControlPanel"

function App() {

  const [mapColor, setMapColor] = useState('')
  const [addedCountry, setAddedCountry] = useState('')
  const [selectedCountries, setSelectedCountries] = useState([])
  const [allCountries, setAllCountries] = useState([])

  const getColor = (color) => {
    setMapColor(color)
  }

  const getCountry = (country) => {
    setAddedCountry(country)
  }

  const handleAddCountry = (country) => {
    setSelectedCountries(prev => [...prev, country])
  }

  const handleRemoveCountry = (country) => {
    setSelectedCountries(prev => prev.filter(c => c !== country))
  }

  const getAllCountries = (list) => {
    setAllCountries(list)
  }


  return (
    <div className="app">
      <Header />
      <main>
        <ControlPanel
          getColorInput={getColor}
          getAddedCountry={getCountry}
          selectedCountries={selectedCountries}
          countriesList={allCountries}
        />
        <MapComponent 
          selectedColor={mapColor}
          addedCountry={addedCountry}
          getAllCountries={getAllCountries}
          onAddCountry={handleAddCountry}
          onRemoveCountry={handleRemoveCountry}
          selectedCountries={selectedCountries}
        />
      </main>
    </div>
  )

}

export default App

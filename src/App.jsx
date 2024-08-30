import React, {useState, useEffect} from "react"
import MapComponent from "./components/MapComponent"
import Header from './components/Header'
import ControlPanel from "./components/ControlPanel"

function App() {

  const [mapColor, setMapColor] = useState('')
  const [addedCountry, setAddedCountry] = useState('')
  const [selectedCountries, setSelectedCountries] = useState([])
  const [allCountries, setAllCountries] = useState([])
  const [isOpen, setIsOpen] = useState(false)

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

  const removeAllCountries = (countries) => {
    countries.forEach(country => {
      handleRemoveCountry(country)
    })
  }


  return (
    <div className="app">
      <Header isOpen={isOpen} setIsOpen={setIsOpen}/>
      <main>
        <ControlPanel
          getColorInput={getColor}
          getAddedCountry={getCountry}
          selectedCountries={selectedCountries}
          countriesList={allCountries}
          removeAllCountries={removeAllCountries}
          isOpen={isOpen}
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

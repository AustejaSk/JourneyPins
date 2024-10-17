import React, { useState } from "react"

import Login from './components/Login'
import MapComponent from "./components/MapComponent"
import Header from './components/Header'
import ControlPanel from "./components/ControlPanel"

function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
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
        {isUserLoggedIn ?
          <>
            <ControlPanel
              getColorInput={getColor}
              getAddedCountry={getCountry}
              selectedCountries={selectedCountries}
              countriesList={allCountries}
              removeAllCountries={removeAllCountries}
              isOpen={isOpen}
              setIsUserLoggedIn={setIsUserLoggedIn}
            />
            <MapComponent 
              selectedColor={mapColor}
              addedCountry={addedCountry}
              getAllCountries={getAllCountries}
              onAddCountry={handleAddCountry}
              onRemoveCountry={handleRemoveCountry}
              selectedCountries={selectedCountries}
            />
          </>
        : <Login setIsUserLoggedIn={setIsUserLoggedIn} /> }
      </main>
    </div>
  )

}

export default App

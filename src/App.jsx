import React, { useState, useEffect } from "react"
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore"
import { app } from './firebase'

import Login from './components/Login'
import MapComponent from "./components/MapComponent"
import Header from './components/Header'
import ControlPanel from "./components/ControlPanel"

function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [mapColor, setMapColor] = useState('')
  const [addedCountry, setAddedCountry] = useState('')
  const [selectedCountries, setSelectedCountries] = useState([])
  const [allCountries, setAllCountries] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  const db = getFirestore(app)

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.emailVerified) {
        setIsUserLoggedIn(true)
        setCurrentUser(user)

        try {
          const userDocRef = doc(db, 'users', user.uid)
          const userDoc = await getDoc(userDocRef)
          if (userDoc.exists()) {
            const data = userDoc.data()
            setSelectedCountries(data.selectedCountries || [])
            setMapColor(data.mapColor || '')
          }
        } catch (error) {
          console.error('Error loading user data: ', error)
        }

      } else {
        setIsUserLoggedIn(false)
        setCurrentUser(null)
        setSelectedCountries([])
        setMapColor('')
      }
    })
    return () => unsubscribe()
  }, [db])

  const getCountry = (country) => {
    setAddedCountry(country)
  }

  const saveSelectedCountriesToFirestore = async (countries) => {
    if (currentUser) {
      try {
        const userDocRef = doc(db, 'users', currentUser.uid)
        await setDoc(userDocRef, { selectedCountries: countries }, { merge: true })
      } catch (error) {
        console.error('Error saving selected countires: ', error)
      }
    }
  }

  const saveMapColorToFirestore = async (color) => {
    if (currentUser) {
      try {
        const userDocRef = doc(db, 'users', currentUser.uid)
        await setDoc(userDocRef, { mapColor: color }, { merge: true })
      } catch (error) {
        console.error('Error saving map color: ', error)
      }
    }
  }

  const handleColorChange = (color) => {
    setMapColor(color)
  }

  const handleColorSelectComplete = (color) => {
    saveMapColorToFirestore(color)
  }
  
  const handleAddCountry = (country) => {
    setSelectedCountries(prev => {
      const updatedCountires = [...prev, country]
      saveSelectedCountriesToFirestore(updatedCountires)
      return updatedCountires
    })
  }

  const handleRemoveCountry = (country) => {
    setSelectedCountries(prev => {
      const updatedCountires = prev.filter(c => c !== country)
      saveSelectedCountriesToFirestore(updatedCountires)
      return updatedCountires
    })
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
      <Header isOpen={isOpen} setIsOpen={setIsOpen} isUserLoggedIn={isUserLoggedIn} />
      <main>
        {isUserLoggedIn ?
          <>
            <ControlPanel
              getColorInput={handleColorChange}
              getColorSelectComplete={handleColorSelectComplete}
              color={mapColor}
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

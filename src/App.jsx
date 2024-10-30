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
  }, [])

  const getCountry = (country) => {
    setAddedCountry(country)
  }

  const saveSelectedCountriesToFirestore = async (countries) => {
    if (currentUser) {
      try {
        const userDocRef = doc(db, 'users', currentUser.uid)
        await setDoc(userDocRef, { selectedCountries: countries }, { merge: true })
      } catch (error) {
        console.error('Error saving selected countries: ', error)
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
    if (currentUser) {
      setSelectedCountries(prev => {
        if (!prev.includes(country)) {
          const updatedCountries = [...prev, country]
          saveSelectedCountriesToFirestore(updatedCountries)
          return updatedCountries
        }
        return prev
      })
    }
  }

  const handleRemoveCountry = (country) => {
    if (currentUser) {
      setSelectedCountries(prev => {
        const updatedCountries = prev.filter(c => c !== country)
        saveSelectedCountriesToFirestore(updatedCountries)
        return updatedCountries
      })
    }
  }

  const getAllCountries = (list) => {
    setAllCountries(list)
  }

  const removeAllCountries = () => {
    if (currentUser) {
      setSelectedCountries([])
      saveSelectedCountriesToFirestore([])
    }
  }


  return (
    <div className="app">
      <Header isOpen={isOpen} setIsOpen={setIsOpen} isUserLoggedIn={isUserLoggedIn} />
      <main>
        {isUserLoggedIn ?
          <>
            <ControlPanel
              color={mapColor}
              getColorInput={handleColorChange}
              getColorSelectComplete={handleColorSelectComplete}
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
              currentUser={currentUser}
              db={db}
            />
          </>
        : <Login setIsUserLoggedIn={setIsUserLoggedIn} /> }
      </main>
    </div>
  )

}

export default App

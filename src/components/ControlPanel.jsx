import React, {useState} from "react"

import { getAuth, signOut } from 'firebase/auth'

const ControlPanel = ({ getColorInput, getAddedCountry, selectedCountries, countriesList, removeAllCountries, isOpen, setIsUserLoggedIn }) => {

    const [color, setColor] = useState('')
    const [country, setCountry] = useState('')
    const [message, setMessage] = useState('')

    const addCountry = (event) => {
        if (event.type === 'click' || event.key === 'Enter') {
            if (country) {
                const countryLowerCase = country.toLowerCase()

                if (selectedCountries.includes(countryLowerCase)) {
                    setMessage('The country is allready added to the map.')
                } else if (countriesList.includes(countryLowerCase)) {
                    getAddedCountry(countryLowerCase)
                    setMessage('')
                } else {
                    setMessage('We couldn’t find that country. Please verify the name or check the spelling.')
                }
                setCountry('')
            }
        }
    }

    const handleRemoveAllCountries = () => {
        removeAllCountries(selectedCountries)
    }

    const signOutUser = () => {
        const auth = getAuth()
        signOut(auth).then(() => {
            setIsUserLoggedIn(false)
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <div className={`control-panel ${isOpen ? 'open' : 'closed'}`}>
            <h1>Customize your map</h1>
            <div className='controls-container'>
                <div className='controls-option'>
                    <label htmlFor='map-color'>Choose a color for your map</label>
                    <input 
                        className='map-color-input'
                        id='map-color'
                        type='color'
                        value={color || '#348285'}
                        onChange={(e) => {
                            setColor(e.target.value)
                            getColorInput(color)
                        }}
                    />
                </div>
                <div className='controls-option' id='country-input-container'>
                    <label htmlFor='country-input'>Add country by name</label>
                    {message && <div style={{ color: 'red', fontSize: '0.85rem' }}>{message}</div>}
                    <input className='country-input'
                        id='country-input'
                        type='text'
                        placeholder='Norway'
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        onKeyDown={addCountry}
                    />
                    <button
                        className='button add-country-btn'
                        onClick={addCountry}
                        onKeyDown={addCountry}
                    >Add Country</button>
                </div>
                <div className='controls-option'>
                    <p className="label">Remove all countries you’ve selected</p>
                    <button
                        className='button remove-countries-btn'
                        onClick={handleRemoveAllCountries}
                    >Remove All Countries</button>
                </div>
            </div>
            <div className='stats-container'>
                <h2>Stats</h2>
                <p>Visited Countries: {selectedCountries.length}</p>
            </div>
            <div className="settings-container">
                <h2>Settings</h2>
                <button className='sign-out-btn' onClick={signOutUser}>Sign Out</button>
            </div>
        </div>
    )
}

export default ControlPanel
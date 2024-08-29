import React, {useState} from "react"

const ControlPanel = ({ getColorInput, getAddedCountry, selectedCountries, countriesList }) => {

    const [color, setColor] = useState('')
    const [country, setCountry] = useState('')
    const [message, setMessage] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault()
        getColorInput(color)

        if (country) {
            if (selectedCountries.includes(country)) {
                setMessage('The country is allready added to the map.')
            } else if (countriesList.includes(country)) {
                getAddedCountry(country.toLowerCase())
                setMessage('')
            } else {
                setMessage('We couldn’t find that country. Please verify the name or check the spelling.')
            }
            setCountry('')
        }
    }

    return (
        <div className='control-panel'>
            <h1>Customize your map</h1>
            <form onSubmit={handleSubmit}>
                <div className='controls-option'>
                    <label htmlFor='map-color'>Choose a color for your map</label>
                    <input 
                        className='map-color-input'
                        id='map-color'
                        type='color'
                        value={color || '#348285'}
                        onChange={(e) => setColor(e.target.value)}
                    />
                </div>
                <div className='controls-option' id='country-input-container'>
                    <label htmlFor='country-input'>Add country by name</label>
                    {message && <div style={{ color: 'red', fontSize: '0.85rem' }}>{message}</div>}
                    <input className='country-input'
                        id='country-input'
                        type='text'
                        placeholder="norway"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    />
                </div>
                <button className='apply-changes-btn'>Apply Changes</button>
            </form>
            <h2>Stats</h2>
            <p>Visited Countries: {selectedCountries.length}</p>
        </div>
    )
}

export default ControlPanel
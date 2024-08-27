import React, {useState} from "react"

const ControlPanel = ({ getColorInput, getAddedCountry }) => {

    const [color, setColor] = useState('')
    const [country, setCountry] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault()
        getColorInput(color)
        getAddedCountry(country.toLowerCase())
        setCountry('')
    }

    return (
        <div className='control-panel'>
            <h1>Customise your map</h1>
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
                <div className='controls-option'>
                    <label htmlFor='countryInput'>Add country by name</label>
                    <input className='country-input'
                        id='countryInput'
                        type='text'
                        placeholder="norway"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    />
                </div>
                <button className='apply-changes-btn'>Apply Changes</button>
            </form>
        </div>
    )
}

export default ControlPanel
import React from 'react'
import { Marker, Popup } from 'react-leaflet'
import pinIcon from '../assets/pin-icon.png'
import uploadIcon from '../assets/upload-icon.png'

const MarkerComponent = ({ marker, setMarkers }) => {

    const markerIcon = L.icon({
        iconUrl: pinIcon,
        iconSize: [35, 35]
      })

    const handleInputChange = (e, id) => {
    setMarkers(prevMarkers => 
        prevMarkers.map(marker =>
        marker.id === id ? {...marker, title: e.target.value} : marker
        )
    )
    }

    const handleImageInput = (e, id) => {
    setMarkers(prevMarkers => 
        prevMarkers.map(marker =>
        marker.id === id ? {...marker, image: e.target.files[0]} : marker
        )
    )
    }

    const handlePopupSubmit = (e, id) => {
    e.stopPropagation()
    setMarkers(prevMarkers => 
        prevMarkers.map(marker =>
        marker.id === id ? {...marker, isEditing: false} : marker
        )
    )
    }

    const removeMarker = (id) => {
        setMarkers(prevMarkers => prevMarkers.filter(marker => marker.id !== id))
      }

    return (
        <Marker
            key={marker.id}
            position={marker.position}
            icon={markerIcon}
            eventHandlers={{add: (e) => {e.target.openPopup()}}}
            >
            <Popup className='popup-container' minWidth='300px'>
                {marker.isEditing ? (
                <div className='popup-inputs-container'>
                    <label htmlFor='title-input' className='popup-label'>Add a title</label>
                    <input
                    className='title-input'
                    id='title-input'
                    type='text'
                    placeholder='My trip to...'
                    value={marker.title}
                    onChange={(e) => handleInputChange(e, marker.id)}
                    />
                    <label htmlFor='image-import' className='popup-label'>Add an image</label>
                    <input
                    type='file'
                    id='image-import'
                    accept="image/png, image/jpeg"
                    onChange={(e) => handleImageInput(e, marker.id)}
                    />
                    {marker.image ? <label htmlFor='image-import' className='image-import-btn'>{marker.image.name}</label> : (
                        <label htmlFor='image-import' className='image-import-btn'><img className='upload-icon' src={uploadIcon}/>Choose a file...</label>
                    )
                    }
                    <div className='popup-btn-container'>
                    <button className='popup-submit-btn' onClick={(e) => handlePopupSubmit(e, marker.id)}>Submit</button>
                    <button className='remove-marker-btn' onClick={() => removeMarker(marker.id)}>Remove Pin</button>
                    </div>
                </div>
                ) : (
                <div>
                    <h3>{marker.title || 'No title'}</h3>
                    {marker.image && <img className='popup-img' src={URL.createObjectURL(marker.image)} />}
                    <button className='remove-marker-btn' onClick={() => removeMarker(marker.id)}>Remove Pin</button>
                </div>
                )}
            </Popup>
        </Marker>
    )
}

export default MarkerComponent
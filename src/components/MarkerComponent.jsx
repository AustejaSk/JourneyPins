import React from 'react'
import { Marker, Popup } from 'react-leaflet'

import pinIcon from '../assets/pin-icon.png'
import hotelPin from '../assets/hotel-pin.png'
import restaurantPin from '../assets/restaurant-pin.png'
import museumPin from '../assets/museum-pin.png'
import landmarkPin from '../assets/landmark-pin.png'
import hikingPin from '../assets/hiking-pin.png'

import uploadIcon from '../assets/upload-icon.png'

const MarkerComponent = ({ marker, setMarkers, onRemoveMarker, onMarkerTitleChange, onMarkerSubmit }) => {

    const markerIcon = () => {
        if (marker.category === 'hotel') {
            return L.icon({
                iconUrl: hotelPin,
                iconSize: [40, 40]
            })
        }

        if (marker.category === 'restaurant') {
            return L.icon({
                iconUrl: restaurantPin,
                iconSize: [35, 35]
            })
        }

        if (marker.category === 'museum') {
            return L.icon({
                iconUrl: museumPin,
                iconSize: [40, 40]
            })
        }

        if (marker.category === 'landmark') {
            return L.icon({
                iconUrl: landmarkPin,
                iconSize: [40, 40]
            })
        }

        if (marker.category === 'hiking') {
            return L.icon({
                iconUrl: hikingPin,
                iconSize: [40, 40]
            })
        }

        if (marker.category === 'other') {
            return L.icon({
                iconUrl: pinIcon,
                iconSize: [35, 35]
            })
        }
    }

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
        onMarkerSubmit(id)
    }

    const removeMarker = (id) => {
        onRemoveMarker(id)
    }

    return (
        <Marker
            key={marker.id}
            position={marker.position}
            icon={markerIcon()}
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
                    placeholder='Epic View Hike'
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
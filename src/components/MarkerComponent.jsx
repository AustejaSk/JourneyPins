import React from 'react'
import { Marker, Popup } from 'react-leaflet'
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage'

import pinIcon from '../assets/pin-icon.png'
import hotelPin from '../assets/hotel-pin.png'
import restaurantPin from '../assets/restaurant-pin.png'
import museumPin from '../assets/museum-pin.png'
import landmarkPin from '../assets/landmark-pin.png'
import hikingPin from '../assets/hiking-pin.png'
import uploadIcon from '../assets/upload-icon.png'

const MarkerComponent = ({ marker, setMarkers, onRemoveMarker, onMarkerSubmit, currentUser }) => {

    const storage = getStorage()

    const markerIcon = () => {
        const iconMap = {
            hotel: { iconUrl: hotelPin, iconSize: [40, 40] },
            restaurant: { iconUrl: restaurantPin, iconSize: [35, 35] },
            museum: { iconUrl: museumPin, iconSize: [40, 40] },
            landmark: { iconUrl: landmarkPin, iconSize: [40, 40] },
            hiking: { iconUrl: hikingPin, iconSize: [40, 40] },
            other: { iconUrl: pinIcon, iconSize: [35, 35] }
        }
    
        const { iconUrl, iconSize } = iconMap[marker.category] || iconMap.other;
        return L.icon({ iconUrl, iconSize })
    }

    const handleInputChange = (e, id) => {
        setMarkers(prevMarkers => 
            prevMarkers.map(marker =>
                marker.id === id ? { ...marker, title: e.target.value } : marker
            )
        )
    }

    const handleImageInput = (e, id) => {
        const addedFile = e.target.files[0]
        if (addedFile) {
            setMarkers(prevMarkers => 
                prevMarkers.map(marker =>
                    marker.id === id ? { ...marker, image: {file: addedFile, name: addedFile.name} } : marker
                )
            )
        }
    }

    const handlePopupSubmit = async (e, id) => {
        e.preventDefault()

        const imageData = marker.image ? await uploadImage(marker.image.file) : null

        const markerData = {
            title: marker.title,
            image: marker.image ? imageData.url : null,
            imagePath: imageData ? imageData.path : null,
            isEditing: false
        }

        onMarkerSubmit(id, markerData)
    }

    const uploadImage = async (imageFile) => {
        try {
            const imagePath = `images/${currentUser.uid}/${imageFile.name}`
            const storageRef = ref(storage, imagePath)
            await uploadBytes(storageRef, imageFile)
            const downloadURL = await getDownloadURL(storageRef)
            return { url: downloadURL, path: imagePath }
        } catch (error) {
            console.error('Error uploading image: ', error)
            return null
        }
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
                    {marker.image ? (
                        <label htmlFor='image-import' className='image-import-btn'>{marker.image.name}</label>
                    ) : (
                        <label htmlFor='image-import' className='image-import-btn'>
                            <img className='upload-icon' src={uploadIcon}/>Choose a file...
                        </label>
                    )}
                    <div className='popup-btn-container'>
                        <button className='popup-submit-btn' onClick={(e) => handlePopupSubmit(e, marker.id)}>Submit</button>
                        <button className='remove-marker-btn' onClick={() => removeMarker(marker.id)}>Remove Pin</button>
                    </div>
                </div>
                ) : (
                <div>
                    <h3>{marker.title || 'No title'}</h3>
                    {marker.image && <img className='popup-img' src={marker.image} />}
                    <button className='remove-marker-btn' onClick={() => removeMarker(marker.id)}>Remove Pin</button>
                </div>
                )}
            </Popup>
        </Marker>
    )
}

export default MarkerComponent
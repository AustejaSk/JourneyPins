import React, { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-contextmenu/dist/leaflet.contextmenu.css'
import 'leaflet-contextmenu'
import MarkerComponent from './MarkerComponent'
import { doc, setDoc, getDoc } from "firebase/firestore"
import { getStorage, ref, deleteObject } from "firebase/storage"


const MapComponent = ({
  selectedColor,
  addedCountry,
  selectedCountries,
  onAddCountry,
  onRemoveCountry,
  getAllCountries,
  currentUser,
  db
}) => {

  const center = [0, 0]
  const maxBounds = [[-90, -180], [90, 180]]
  const [geoJSONData, setGeoJSONData] = useState(null)
  const geoJsonLayerRef = useRef()
  const customRenderer = L.svg({ padding: 0.4 });
  const storage = getStorage()
  const [markers, setMarkers] = useState([])

  useEffect(() => {
    fetch('/countries.geojson')
      .then(res => res.json())
      .then(data => {
        setGeoJSONData(data)
        const countires = data.features.map(feature => feature.properties.ADMIN.toLowerCase())
        getAllCountries(countires)
      })
      .catch(error => console.error('Error fetching GeoJSON:', error))
  }, [])


  useEffect(() => {
    const loadMarkers = async () => {
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid)
        const userDoc = await getDoc(userDocRef)
        if (userDoc.exists()) {
          const data = userDoc.data()
          setMarkers(data.markers || [])
        }
      }
    }
    loadMarkers()
  }, [currentUser, db])


  useEffect(() => {
    if (addedCountry) {
      if (!selectedCountries.includes(addedCountry)) {
        onAddCountry(addedCountry)
      }
    }
  }, [addedCountry])


  const clickTimeout = useRef(null)

  const onEachCountry = (country, layer) => {

    layer.bindTooltip(country.properties.ADMIN, {
      direction: 'auto',
      offset: [0,0],
      className: 'custom-tooltip'
    })

    const countryName = country.properties.ADMIN.toLowerCase()

    layer.on({

      click: () => {
        if (clickTimeout.current) {
          clearTimeout(clickTimeout.current)
          clickTimeout.current = null
        } else { 
          clickTimeout.current = setTimeout(() => {
            clickTimeout.current = null
            if (!selectedCountries.includes(countryName)) {
              onAddCountry(countryName)
            }
          }, 200)
        }
      },

      dblclick: () => {
        if (clickTimeout.current) {
          clearTimeout(clickTimeout.current)
          clickTimeout.current = null
        }
        onRemoveCountry(countryName)
      }
    })
  }


  const defaultStyle = {
    fillColor: '#FFFFFF',
    color: 'none',
    fillOpacity: 0.5
  }

  const geoJsonStyle = (feature) => {
    const countryName = feature.properties.ADMIN.toLowerCase()

    if (selectedCountries.includes(countryName)) {
      return {
        fillColor: selectedColor || '#348285',
        color: 'none',
        fillOpacity: 0.5,
        weight: 1
      }
    }
    return defaultStyle
  }


  const addMarker = (e, catogory) => {
    const newMarker = {
      id: Date.now(),
      position: [e.latlng.lat, e.latlng.lng],
      title: '',
      image: null,
      isEditing: true,
      category: catogory
    }
    setMarkers(prevMarkers => {
      const updatedMarkers = [...prevMarkers, newMarker]
      saveMarkersToFirestore(updatedMarkers)
      return updatedMarkers
    })
  }

  const removeMarker = (markerId) => {
    setMarkers(prevMarkers => {
      const selectedMarker = prevMarkers.find(marker => markerId === marker.id)

      if (selectedMarker.imagePath) {
        const imageRef = ref(storage, selectedMarker.imagePath)
        deleteObject(imageRef).catch(error => {
          console.error('Error deleting image: ', error)
        })
      }

      const updatedMarkers = prevMarkers.filter(marker => markerId !== marker.id)
      saveMarkersToFirestore(updatedMarkers)
      return updatedMarkers
    })
  }

  const handleMarkerSubmit = (markerId, markerData) => {
    setMarkers(prevMarkers => {
      const updatedMarkers = prevMarkers.map(marker => 
        marker.id === markerId ? { ...marker, ...markerData } : marker
      )
      saveMarkersToFirestore(updatedMarkers)
      return updatedMarkers
    })
  }

  const saveMarkersToFirestore = async (markers) => {
    if (currentUser) {
      try {
        const userDocRef = doc(db, 'users', currentUser.uid)
        await setDoc(userDocRef, { markers: markers }, { merge: true })
      } catch (error) {
        console.error('Error saving markers: ', error)
      }
    }
  }
  
  return (
      <MapContainer 
          center={center}
          zoom={2}
          minZoom={2}
          maxZoom={18}
          className='map'
          zoomControl={false}
          doubleClickZoom={false}
          maxBounds={maxBounds}
          maxBoundsViscosity={1.0}
          contextmenu={true}
          contextmenuWidth={140}
          contextmenuItems= {[
            {text: '<strong>Choose Category</strong>',
            callback: null,
            disabled: true},
            {text: `<i class="fa-solid fa-hotel"></i> Hotel`,
            callback: (e) => addMarker(e, 'hotel')},
            {text: `<i class="fas fa-utensils"></i> Restaurant`,
            callback: (e) => addMarker(e, 'restaurant')},
            {text: `<i class="fas fa-landmark"></i> Museum`,
            callback: (e) => addMarker(e, 'museum')},
            {text: `<i class="fa-solid fa-monument"></i> Landmark`,
            callback: (e) => addMarker(e, 'landmark')},
            {text: `<i class="fa-solid fa-person-hiking"></i> Hiking Spot`,
            callback: (e) => addMarker(e, 'hiking')},
            {text: `<i class="fa-solid fa-location-pin"></i> Other`,
            callback: (e) => addMarker(e, 'other')}
        ]}
      >
          <TileLayer
              url='https://tile.openstreetmap.org/{z}/{x}/{y}.png'
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {geoJSONData && (
              <GeoJSON 
                data={geoJSONData}
                onEachFeature={onEachCountry}
                ref={geoJsonLayerRef}
                style={geoJsonStyle}
                renderer={customRenderer}
              />
          )}
          {markers && markers.length > 0 && markers.map(marker => (
            <MarkerComponent
              key={marker.id}
              marker={marker}
              setMarkers={setMarkers}
              onRemoveMarker={removeMarker}
              onMarkerSubmit={handleMarkerSubmit}
              currentUser={currentUser}
            />
          ))}
      </MapContainer>
  )
}

export default MapComponent
import React, { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-contextmenu/dist/leaflet.contextmenu.css'
import 'leaflet-contextmenu'
import MarkerComponent from './MarkerComponent'


const MapComponent = ({ selectedColor, addedCountry, selectedCountries, onAddCountry, onRemoveCountry, getAllCountries }) => {
    const center = [0, 0]
    const maxBounds = [[-90, -180], [90, 180]]
    const [geoJSONData, setGeoJSONData] = useState(null)
    const geoJsonLayerRef = useRef()
    const selectedColorRef = useRef(selectedColor)
    const [markers, setMarkers] = useState([])


    // Fetching countries from geoJson and saving them in a state. Calling getAllCountries with all country names from geoJson.

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


    // Adding country from the input field if it isn't selected on the map yet.

    useEffect(() => {
      if (addedCountry) {
        if (!selectedCountries.includes(addedCountry)) {
          onAddCountry(addedCountry)
        }
      }
    }, [addedCountry])
    

    // Adding toolip that shows country name and click and dbclick events for each layer.

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


    // Setting color for each layer on the map based on if the layer is in the selectedCountries array or not.

    const defaultStyle = {
      fillColor: '#FFFFFF',
      color: 'none',
      fillOpacity: 0.5
    }

    useEffect(() => {
      selectedColorRef.current = selectedColor || "#348285"

      if (geoJsonLayerRef.current) {

        geoJsonLayerRef.current.eachLayer(layer => {

          const countryName = layer.feature.properties.ADMIN.toLowerCase()

          if (selectedCountries.includes(countryName)) {
            layer.setStyle({
              fillColor: selectedColorRef.current,
              fillOpacity: 0.5,
              color: 'none',
              weight: '1'
            })
          } else {
            layer.setStyle(defaultStyle)
          }
        })
      }
    }, [selectedColor, selectedCountries, markers])


    // Callback for contextmenuItems that adds a marker to the map.

    const addPin = (e) => {
      const newMarker = {
        id: Date.now(),
        position: [e.latlng.lat, e.latlng.lng],
        title: '',
        image: null,
        isEditing: true,
      }
      setMarkers((prevMarkers) => [...prevMarkers, newMarker])
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
              callback: addPin},
              {text: `<i class="fas fa-utensils"></i> Restaurant`,
              callback: addPin},
              {text: `<i class="fas fa-landmark"></i> Museum`,
              callback: addPin},
              {text: `<i class="fa-solid fa-monument"></i> Landmark`,
              callback: addPin},
              {text: `<i class="fa-solid fa-person-hiking"></i> Hiking Spot`,
              callback: addPin},
              {text: `<i class="fa-solid fa-location-pin"></i> Not Specified`,
              callback: addPin}

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
                  style={defaultStyle}
                />
            )}
            {markers && markers.length > 0 && markers.map((marker) => (
              <MarkerComponent marker={marker} setMarkers={setMarkers} />
            ))}
        </MapContainer>
    )
}

export default MapComponent
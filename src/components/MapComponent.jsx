import React, { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-contextmenu/dist/leaflet.contextmenu.css'
import 'leaflet-contextmenu'
import pinIcon from '../assets/pin-icon.png'


const MapComponent = ({ selectedColor, addedCountry, selectedCountries, onAddCountry, onRemoveCountry, getAllCountries }) => {
    const center = [0, 0]
    const maxBounds = [[-90, -180], [90, 180]]
    const [geoJSONData, setGeoJSONData] = useState(null)
    const geoJsonLayerRef = useRef()
    const selectedColorRef = useRef(selectedColor)
    const [map, setMap] = useState(null)
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

    const defaultStyle = {
      fillColor: '#FFFFFF',
      color: 'none',
      fillOpacity: 0.5
    }

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

    const addPin = (e) => {
      const newMarker = {
        id: Date.now(),
        position: [e.latlng.lat, e.latlng.lng],
        title: '',
        isEditing: true
      }
      setMarkers((prevMarkers) => [...prevMarkers, newMarker])
    }

    const removeMarker = (id) => {
      setMarkers(prevMarkers => prevMarkers.filter(marker => marker.id !== id))
    }

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

    const handleSubmitTitle = (id) => {
      setMarkers(prevMarkers => 
        prevMarkers.map(marker =>
          marker.id === id ? {...marker, isEditing: false} : marker
        )
      )
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
            ref={setMap}
            contextmenu={true}
            contextmenuWidth={140}
            contextmenuItems= {[{
              text: 'Add a pin',
              callback: addPin
            }]}
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
              <Marker key={marker.id} position={marker.position} icon={markerIcon}>
                <Popup>
                  {marker.isEditing ? (
                    <div>
                      <input type='text' value={marker.title} onChange={(e) => handleInputChange(e, marker.id)} placeholder='Enter title'/>
                      <button onClick={() => handleSubmitTitle(marker.id)}>Submit</button>
                    </div>
                  ) : <h3>{marker.title || 'No title'}</h3>}
                  <button onClick={() => removeMarker(marker.id)}>Remove Pin</button>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
    )
}

export default MapComponent
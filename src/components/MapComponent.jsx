import React, { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'


const MapComponent = ({ selectedColor, addedCountry, selectedCountries, onAddCountry, onRemoveCountry, getAllCountries }) => {
    const center = [0, 0]
    const maxBounds = [[-90, -180], [90, 180]]

    const [geoJSONData, setGeoJSONData] = useState(null)

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

    const geoJsonLayerRef = useRef()
    const selectedColorRef = useRef(selectedColor)

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
          }
        })
      }
    }, [selectedColor, selectedCountries])

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
        </MapContainer>
    )
}

export default MapComponent
import React, { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const MapComponent = ({ selectedColor, addedCountry }) => {
    const center = [0, 0]
    const maxBounds = [[-90, -180], [90, 180]]

    const [geoJSONData, setGeoJSONData] = useState(null)

    useEffect(() => {
      fetch('/countries.geojson')
        .then(res => res.json())
        .then(data => setGeoJSONData(data))
        .catch(error => console.error('Error fetching GeoJSON:', error))
    }, [])

    const geoJsonLayerRef = useRef()
    const selectedColorRef = useRef(selectedColor)
    const [selectedCountries, setSelectedCountries] = useState([])

    const defaultStyle = {
      fillColor: '#FFFFFF',
      color: 'none',
      fillOpacity: 0.5
    }

    useEffect(() => {
      if (selectedCountries !== addedCountry) {
        setSelectedCountries(prevSelected => [...prevSelected, addedCountry])
      }
    }, [addedCountry])

    const onEachCountry = (country, layer) => {

      layer.bindTooltip(country.properties.ADMIN, {
        direction: 'auto',
        offset: [0,0],
        className: 'custom-tooltip'
      })

      const countryName = country.properties.ADMIN.toLowerCase()

      layer.on({

        click: () => {
          if (!selectedCountries.includes(countryName)) {
            setSelectedCountries(prevSelected => [...prevSelected, countryName])
          }
        },

        dblclick: () => {
            setSelectedCountries(prevSelected => prevSelected.filter(country => country !== countryName))
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
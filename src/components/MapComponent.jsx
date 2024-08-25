import React, { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, GeoJSON } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const MapComponent = () => {
    const center = [0, 0]

    const [geoJSONData, setGeoJSONData] = useState(null)

    useEffect(() => {
      fetch('/countries.geojson')
        .then(res => res.json())
        .then(data => setGeoJSONData(data))
        .catch(error => console.error('Error fetching GeoJSON:', error))
    }, [])

    const SetMaxBounds = ({ padding }) => {
        const map = useMap()

        useEffect(() => {
            const bounds = map.getBounds()

            const southWest = bounds.getSouthWest()
            const northEast = bounds.getNorthEast()

            const latPadding = padding.lat || 0.01
            const lngPadding = padding.lng || 0.01

            const paddedBounds = L.latLngBounds(
                L.latLng(southWest.lat - latPadding, southWest.lng - lngPadding),
                L.latLng(northEast.lat + latPadding, northEast.lng + lngPadding)
            )

            map.setMaxBounds(paddedBounds)
            map.options.maxBoundsViscosity = 1.0
        }, [map, padding])

        return null
    }

    const geoJsonLayerRef = useRef()

    const onEachCountry = (country, layer) => {

      layer.bindTooltip(country.properties.ADMIN, {
        direction: 'auto',
        offset: [0,0],
        className: 'custom-tooltip'
      })

      layer.on({
        click: () => {
          layer.setStyle({
            fillColor: 'pink',
            fillOpacity: 0.7,
            color: 'red',
            weight: '1'
          })
        },

        dblclick: () => {
          if (geoJsonLayerRef.current) {
            geoJsonLayerRef.current.resetStyle(layer)
          }
        }

      })
    }


    return (
        <MapContainer 
            center={center}
            zoom={2}
            minZoom={2}
            maxZoom={18}
            style={{ height: '80vh', width: '100%' }}
            zoomControl={false}
            doubleClickZoom={false}
        >
            <TileLayer
                url='https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {geoJSONData && (
                <GeoJSON data={geoJSONData}
                  style={{color: 'none', fillColor: '#FFFFFF'}}
                  onEachFeature={onEachCountry}
                  ref={geoJsonLayerRef}
                />
            )}
            <SetMaxBounds padding={{ lat: 8, lng: 30 }} />
        </MapContainer>
    )
}

export default MapComponent
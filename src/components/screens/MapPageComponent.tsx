"use client"

import { useEffect, useRef, useState } from "react"
import L, { type LatLng } from "leaflet"
import "leaflet/dist/leaflet.css"
import * as turf from "@turf/turf"
import torontoBuilding from "./buildings.json"

export default function MapPageComponent() {
  const mapRef = useRef<L.Map | null>(null)
  const propertyLayerRef = useRef<L.GeoJSON | null>(null)
  const [claimedProperties, setClaimedProperties] = useState(new Set<number>())
  const [popupMarker, setPopupMarker] = useState<L.Marker | null>(null) // Store the temporary claim marker

  useEffect(() => {
    if (mapRef.current) return // Prevent duplicate map initialization

    const torontoCenter: LatLng = L.latLng(43.7, -79.42)
    const bounds = L.latLngBounds([43.681, -79.46], [43.719, -79.38])

    const map = L.map("map", {
      center: torontoCenter,
      zoom: 14,
      minZoom: 14,
      maxZoom: 20,
      maxBounds: bounds,
      maxBoundsViscosity: 1.0,
    })

    mapRef.current = map

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: "© OpenStreetMap contributors, Tiles: HOT OSM",
      bounds: bounds,
      noWrap: true,
      minZoom: 14,
      maxZoom: 20,
    }).addTo(map)

    const propertyLayer = L.geoJSON(null, {
      style: () => ({
        color: "#00A86B",
        weight: 1,
        fillOpacity: 0.5,
      }),
      onEachFeature: (feature, layer) => {
        if (feature.geometry.type === "Polygon") {
          layer.on("click", (e) => showClaimMarker(e.latlng, feature.properties.id))
        }
      },
    }).addTo(map)

    propertyLayerRef.current = propertyLayer
    loadBuildings()
  }, [])

  // Function to show a marker popup with a Claim button
  const showClaimMarker = (latlng: L.LatLng, featureId: number) => {
    if (claimedProperties.has(featureId)) return

    // Remove any existing claim marker
    if (popupMarker) {
      popupMarker.remove()
    }

    // Create a new marker at the clicked location
    const marker = L.marker(latlng)
      .addTo(mapRef.current!)
      .bindPopup(
        `<button id="claim-btn" style="background:#4cd6e3; color:#1a1528; padding:5px 10px; border:none; cursor:pointer; font-weight:bold; border-radius:4px;">Claim</button>`,
      )
      .openPopup()

    setPopupMarker(marker)

    // Wait for the button to render and attach an event listener
    setTimeout(() => {
      const btn = document.getElementById("claim-btn")
      if (btn) {
        btn.addEventListener("click", () => claimProperty(featureId, marker))
      }
    }, 100)
  }

  // Function to claim a property and update its color
  const claimProperty = (featureId: number, marker: L.Marker) => {
    setClaimedProperties((prev) => new Set(prev).add(featureId))

    // Find the corresponding layer and update its style
    const layer = propertyLayerRef.current?.getLayers().find((l) => (l as any).feature.properties.id === featureId)

    if (layer) {
      ;(layer as any).setStyle({ color: "#4cd6e3", weight: 2, fillOpacity: 0.7 })
    }

    // Remove the claim marker
    marker.remove()
  }

  // Function to load building data and add it to the map
  const loadBuildings = async () => {
    try {
      const data = torontoBuilding

      const nodes: Record<number, [number, number]> = {}
      data.elements.forEach((el: any) => {
        if (el.type === "node") {
          nodes[el.id] = [el.lon, el.lat]
        }
      })

      const features = data.elements
        .filter((el: any) => el.type === "way" && el.nodes)
        .map((el: any) => {
          const coordinates = el.nodes.map((nodeId: number) => nodes[nodeId])
          const areaSqMeters = turf.area({
            type: "Feature",
            properties: {},
            geometry: {
              type: "Polygon",
              coordinates: [coordinates],
            },
          })

          return {
            type: "Feature",
            properties: { id: el.id, areaSqMeters },
            geometry: {
              type: "Polygon",
              coordinates: [coordinates],
            },
          }
        })

      propertyLayerRef.current?.clearLayers()
      propertyLayerRef.current?.addData({
        type: "FeatureCollection",
        features,
      })
    } catch (error) {
      console.error("Error loading buildings:", error)
    }
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div id="map" style={{ width: "100%", height: "100%" }}></div>
    </div>
  )
}




"use client";// Ensures this runs only on the client side

// 'use client'; // Ensure it runs only on the client side

import { useEffect, useRef, useState} from 'react';
import { MapContainer } from '../../../node_modules/react-leaflet/lib/MapContainer';
import { TileLayer } from '../../../node_modules/react-leaflet/lib/TileLayer';
import { useMap } from '../../../node_modules/react-leaflet/lib/hooks';


import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function MapPageComponent() {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [mapVisible, setMapVisible] = useState(true);

  useEffect(() => {
    if (mapVisible && !mapRef.current) {
      // Initialize map when it becomes visible
      mapRef.current = L.map(mapContainerRef.current).setView([51.505, -0.09], 13);
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> contributors',
        subdomains: "abcd",
        maxZoom: 20,
      }).addTo(mapRef.current);
    }
  }, [mapVisible]); // Runs when mapVisible changes

  return (
    <div>
      {/* <button onClick={() => setMapVisible(true)}>Show</button> */}
      <div
        ref={mapContainerRef}
        style={{
          display: mapVisible ? "block" : "none",
          width: "100%",
          height: "90vh",
          marginTop: "10px",
        }}
      />
    </div>
  );
}

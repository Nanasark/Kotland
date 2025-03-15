// "use client"

// import { useEffect, useRef, useState } from "react"
// import L, { type LatLng } from "leaflet"
// import "leaflet/dist/leaflet.css"
// import * as turf from "@turf/turf"

// export default function MapPageComponent() {
//   const mapRef = useRef<L.Map | null>(null)
//   const propertyLayerRef = useRef<L.GeoJSON | null>(null)
//   const claimedProperties = useRef(new Set());
//   const [popupMarker, setPopupMarker] = useState<L.Marker | null>(null) // Store the temporary claim marker

//   useEffect(() => {
//     if (mapRef.current) return // Prevent duplicate map initialization

//     const torontoCenter: LatLng = L.latLng(43.7, -79.42)
//     const bounds = L.latLngBounds(
//       [43.695, -79.435], 
//       [43.705, -79.405]
//     )

//     const map = L.map("map", {
//       center: torontoCenter,
//       zoom: 14,
//       minZoom: 14,
//       maxZoom: 20,
//       maxBounds: bounds,
//       zoomControl: true,
//       maxBoundsViscosity: 1.0,
//     })

//     mapRef.current = map

//     L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
//       attribution: "© OpenStreetMap contributors, Tiles: HOT OSM",
//       bounds: bounds,
//       noWrap: true,
//       minZoom: 14,
//       maxZoom: 20,
//     }).addTo(map)

//     const propertyLayer = L.geoJSON(null, {
//       style: () => ({
//         color: "#00A86B",
//         weight: 1,
//         fillOpacity: 0.5,
//       }),
//       onEachFeature: (feature, layer) => {
//         if (feature.geometry.type === "Polygon") {
//           layer.on("click", () => showClaimPopup(layer, feature.properties.id));
//         }
//       },
//     }).addTo(map)

//     propertyLayerRef.current = propertyLayer
//     loadBuildings()
//   }, [])

  

//   function showClaimPopup(layer: L.Layer, featureId: number) {
//     if (claimedProperties.current.has(featureId)) return;

//     const areaSqMeters = calculateBuildingArea(layer.toGeoJSON() as any);

//     const popupContnent = `
//       <p> Area: ${areaSqMeters.toFixed(2)} sqM </p>
//       <button onclick="window.claimProperty(${featureId})">Claim</button>
//     `;
//     layer.bindPopup(popupContnent).openPopup();
//   }

//   useEffect(() => {
//     (window as any).claimProperty = claimProperty;
//   }, []);

//   function claimProperty(featureId: number) {
//     const propertyLayer = propertyLayerRef.current;
//     if(!propertyLayer) return;

//     const layer = propertyLayer.getLayers().find((l) => {
//       const feature = (l as L.GeoJSON).feature;
//       return feature?.properties?.id === featureId;
//     });
//     if(!layer) return;

//     claimedProperties.current.add(featureId);
//     (layer as L.Path).setStyle({ color: "#FFD700", weight: 2, fillOpacity: 0.7 });
//     (layer as L.Layer).closePopup();

//   }


//   function calculateBuildingArea(feature: any){
//     try {
//       return turf.area(feature);
//     } catch (err) {
//       console.warn("Area calcuation faied", err);
//       return 0;
//     }
//   }

//   // Function to load building data and add it to the map
//   function loadBuildings() {
//     const overpassQuery = `
//       [out:json]; 
//       (way[building](43.695,-79.435,43.705,-79.405););
//       (._;>;); 
//       out body;
//     `;

//     const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(overpassQuery);

//     fetch(url)
//       .then((res) => res.json())
//       .then((data) => {
//         const nodes: Record<number, [number, number]> = {};
//         data.elements.forEach((el: any) => {
//           if (el.type === "node") {
//             nodes[el.id] = [el.lon, el.lat];
//           }
//         });

//         const geojsonFeatures = data.elements
//           .filter((el: any) => el.type === "way" && el.nodes)
//           .map((el: any) => ({
//             type: "Feature",
//             properties: { id: el.id },
//             geometry: {
//               type: "Polygon",
//               coordinates: [el.nodes.map((nodeId: number) => nodes[nodeId])]
//             }
//           }));

//         propertyLayerRef.current?.clearLayers();
//         propertyLayerRef.current?.addData({
//           type: "FeatureCollection",
//           features: geojsonFeatures
//         });
//       })
//       .catch((err) => console.error("Error loading buildings:", err));
//   }

//   return (
//     <div style={{ width: "100%", height: "100%" }}>
//       <div id="map" style={{ width: "100%", height: "100%" }}></div>
//     </div>
//   )
// }


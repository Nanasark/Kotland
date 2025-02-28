"use client";  // for Next.js App Router (v13+)

import { useEffect, useRef, useState } from "react";
import L, { LatLng, LatLngBounds } from "leaflet";
import "leaflet/dist/leaflet.css";
import * as turf from "@turf/turf";
import torontoBuilding from "./buildings.json";

export default function MapPageComponent() {
    const mapRef = useRef(null);
    const propertyLayerRef = useRef(null);
    const [claimedProperties, setClaimedProperties] = useState(new Set());

    useEffect(() => {
        if (mapRef.current) return; // Prevent duplicate map initialization

        const torontoCenter:LatLng = L.latLng(43.7, -79.42);

        const bounds = L.latLngBounds(
            [43.681, -79.46],
            [43.719, -79.38]
        );

        const map = L.map("map", {
            center: torontoCenter,
            zoom: 14,
            minZoom: 14,
            maxZoom: 20,
            maxBounds: bounds,
            maxBoundsViscosity: 1.0,
        });

        mapRef.current = map;

        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
            attribution: "© OpenStreetMap contributors, Tiles: HOT OSM",
            bounds: bounds,
            noWrap: true,
            minZoom: 14,
            maxZoom: 20,
        }).addTo(map);

        const propertyLayer = L.geoJSON(null, {
            style: (feature) => ({
                color: "#00A86B",
                weight: 1,
                fillOpacity: 0.5,
            }),
            onEachFeature: (feature, layer) => {
                layer.on("click", () => showClaimPopup(layer, feature.properties.id));
            },
        }).addTo(map);

        propertyLayerRef.current = propertyLayer;

        loadBuildings();

    }, []);

    const showClaimPopup = (layer, featureId) => {
        if (claimedProperties.has(featureId)) return;

        const popupContent = `<button onclick="window.claimProperty('${featureId}')">Claim</button>`;
        layer.bindPopup(popupContent).openPopup();

        // Attach claim function to window (hacky way to trigger from popup button)
        window.claimProperty = (id) => claimProperty(id);
    };

    const claimProperty = (featureId) => {
        setClaimedProperties((prev) => {
            const newSet = new Set(prev);
            newSet.add(featureId);
            return newSet;
        });

        const layer = propertyLayerRef.current?.getLayers().find(
            (l) => l.feature.properties.id === parseInt(featureId)
        );

        if (layer) {
            layer.setStyle({ color: "#FFD700", weight: 2, fillOpacity: 0.7 });
            layer.closePopup();
        }
    };

    const loadBuildings = async () => {
        // const overpassQuery = `
        //     [out:json]; 
        //     (
        //         way[building](43.681,-79.46,43.719,-79.38); 
        //     );
        //     (._;>;); 
        //     out body;
        // `;

        // const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

        try {
            // const response = await fetch(url);
            // const data = await response.json();
            const data = torontoBuilding;

            const nodes = {};
            data.elements.forEach((el) => {
                if (el.type === "node") {
                    nodes[el.id] = [el.lon, el.lat];
                }
            });

            const features = data.elements
                .filter((el) => el.type === "way" && el.nodes)
                .map((el) => {
                    const coordinates = el.nodes.map((nodeId) => nodes[nodeId]);
                    const areaSqMeters = turf.area({
                        type: "Feature",
                        properties: {},
                        geometry: {
                            type: "Polygon",
                            coordinates: [coordinates],
                        },
                    });

                    return {
                        type: "Feature",
                        properties: { id: el.id, areaSqMeters },
                        geometry: {
                            type: "Polygon",
                            coordinates: [coordinates],
                        },
                    };
                });

            console.log(features);

            propertyLayerRef.current?.clearLayers();
            propertyLayerRef.current?.addData({
                type: "FeatureCollection",
                features,
            });

        } catch (error) {
            console.error("Error loading buildings:", error);
        }
    };

    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <div id="map" style={{ width: "100%", height: "100%" }}></div>
        </div>
    );
}

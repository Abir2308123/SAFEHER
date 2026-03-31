"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polygon, CircleMarker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion, AnimatePresence } from "framer-motion";

// GeoJSON coordinate parsing for the simple polygon
const geoJSONData = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[80.04523800527596,12.829851693824907],[80.0445928454203,12.829820789659284],[80.04395389927834,12.829728374809083],[80.04332732070418,12.829575339346903],[80.04271914440996,12.829363157196832],[80.0421352278321,12.829093871935553],[80.04158119470706,12.828770077105943],[80.04106238089994,12.828394891232984],[80.0405837830088,12.827971927782816],[80.04015001023927,12.827505260354584],[80.03976524001368,12.826999383440619],[80.03943317774191,12.826459169133171],[80.0391570211417,12.825889820195016],[80.03893942945137,12.825296819946173],[80.0387824978315,12.824685879449673],[80.03868773720149,12.824062882505265],[80.03865605970458,12.823433828981063],[80.03868776994094,12.82280477702893],[80.03878256205226,12.822181784740307],[80.03893952268547,12.821570851804385],[80.03915713980619,12.820977861730372],[80.0394333172766,12.820408525190283],[80.03976539505632,12.81986832502769],[80.04015017483168,12.81936246346178],[80.04058395082576,12.818895811994997],[80.04106254549234,12.81847286450628],[80.0415813497497,12.81809769398138],[80.04213536736681,12.817773913296623],[80.04271926307446,12.81750464043341],[80.04332741393829,12.81729246845817],[80.04395396349909,12.81713944055657],[80.04459287815976,12.817047030362152],[80.04523800527596,12.817016127768598],[80.04588313239218,12.817047030362152],[80.04652204705283,12.81713944055657],[80.04714859661364,12.81729246845817],[80.04775674747746,12.81750464043341],[80.04834064318513,12.817773913296623],[80.04889466080222,12.81809769398138],[80.04941346505959,12.81847286450628],[80.04989205972616,12.818895811994997],[80.05032583572026,12.81936246346178],[80.05071061549562,12.81986832502769],[80.05104269327532,12.820408525190283],[80.05131887074572,12.820977861730372],[80.05153648786646,12.821570851804385],[80.05169344849965,12.822181784740307],[80.05178824061099,12.82280477702893],[80.05181995084736,12.823433828981063],[80.05178827335045,12.824062882505265],[80.05169351272042,12.824685879449673],[80.05153658110056,12.825296819946173],[80.05131898941022,12.825889820195016],[80.05104283281003,12.826459169133171],[80.05071077053826,12.826999383440619],[80.05032600031265,12.827505260354584],[80.04989222754311,12.827971927782816],[80.04941362965198,12.828394891232984],[80.04889481584487,12.828770077105943],[80.04834078271982,12.829093871935553],[80.04775686614197,12.829363157196832],[80.04714868984775,12.829575339346903],[80.0465221112736,12.829728374809083],[80.04588316513164,12.829820789659284],[80.04523800527596,12.829851693824907]]]}}]} as const;

// Leaflet expects [lat, lng] instead of GeoJSON's [lng, lat]
const campusBounds: [number, number][] = geoJSONData.features[0].geometry.coordinates[0].map((coord) => [coord[1], coord[0]]);

type Pin = {
  id: string;
  lat: number;
  lng: number;
  type: "safe" | "uneasy" | "danger";
};

interface HeatMapProps {
  timeOfDay: number; // 8 to 24 (8 AM to 12 AM)
  density: number; // 0 to 100
}

// Subcomponent to handle map clicks for pins
function ClickHandler({ onMapClick }: { onMapClick: (e: L.LeafletMouseEvent) => void }) {
  useMapEvents({
    click: (e) => onMapClick(e),
  });
  return null;
}

export function HeatMap({ timeOfDay, density }: HeatMapProps) {
  const [pins, setPins] = useState<Pin[]>([]);
  const [selectedPinType, setSelectedPinType] = useState<"safe" | "uneasy" | "danger">("safe");

  const getFloorColor = () => {
    let dangerScore = 0;
    if (timeOfDay > 18) {
      dangerScore += (timeOfDay - 18) * 10;
    }
    if (timeOfDay > 18 && density < 30) {
      dangerScore += 30; // empty dark office
    } else if (density > 70) {
      dangerScore -= 20; // crowded
    }

    if (dangerScore > 50) return "#dc2626"; // Red
    if (dangerScore > 20) return "#eab308"; // Yellow
    return "#10b981"; // Green
  };

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    setPins((prevPins) => [
      ...prevPins,
      {
        id: Math.random().toString(),
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        type: selectedPinType,
      },
    ]);
  };

  const centerLat = 12.823433828981063;
  const centerLng = 80.04523800527596;

  return (
    <div className="flex flex-col h-full w-full relative">
      {/* Pin Controls */}
      <div className="flex gap-2 mb-4 absolute top-4 left-4 z-[400] bg-zinc-900/80 p-2 rounded-lg backdrop-blur-md border border-zinc-700 shadow-xl">
        <button 
          onClick={() => setSelectedPinType("safe")}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${selectedPinType === 'safe' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          Drop Safe Pin
        </button>
        <button 
          onClick={() => setSelectedPinType("uneasy")}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${selectedPinType === 'uneasy' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          Drop Uneasy Pin
        </button>
        <button 
          onClick={() => setSelectedPinType("danger")}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${selectedPinType === 'danger' ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          Drop Danger Pin
        </button>
      </div>

      {/* React Leaflet Map */}
      <div className="flex-1 w-full h-full relative cursor-crosshair rounded-lg overflow-hidden border border-zinc-800/50 shadow-inner">
        <MapContainer 
          center={[centerLat, centerLng]} 
          zoom={16} 
          scrollWheelZoom={true} 
          className="w-full h-full z-0"
        >
          {/* Esri World Imagery (Satellite tiles without labels for a stealth look) */}
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
          {/* Optional Stamen Toner Labels for dark roads, can add if needed. Keeping it clean satellite for now */}
          
          <ClickHandler onMapClick={handleMapClick} />

          {/* Dynamic Campus Heat Map Polygon Overlay */}
          <Polygon 
             positions={campusBounds} 
             pathOptions={{ 
               color: '#3B82F6', 
               fillColor: getFloorColor(), 
               fillOpacity: 0.4, 
               weight: 2 
             }} 
          />

          {/* Render Dropped Pins */}
          {pins.map((pin) => (
            <CircleMarker 
               key={pin.id}
               center={[pin.lat, pin.lng]}
               radius={6}
               pathOptions={{
                 color: 'transparent',
                 fillColor: pin.type === 'safe' ? '#10b981' : pin.type === 'uneasy' ? '#eab308' : '#ef4444',
                 fillOpacity: 0.9,
               }}
            >
               {/* Custom CSS pulse animation using a second outer circle marker could be added here, 
                   but CircleMarker styling inherently supports standard attributes. */}
            </CircleMarker>
          ))}
        </MapContainer>
        
        {/* Subtle Overlay to maintain dark mode aesthetic over bright satellite maps */}
        <div className="absolute inset-0 bg-brand-purple/5 pointer-events-none z-[400] mix-blend-overlay"></div>
      </div>
    </div>
  );
}

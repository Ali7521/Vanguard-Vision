import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Rectangle, LayersControl, useMap } from 'react-leaflet';
import { LocateFixed } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix missing marker icons
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface Props {
  center: [number, number];
}

function MapControls({ center }: { center: [number, number] }) {
  const map = useMap();
  const [liveLocation, setLiveLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    map.setView(center, 15);
    setTimeout(() => {
      map.invalidateSize();
    }, 400);
  }, [center, map]);

  const goToLiveLocation = () => {
    map.locate().on("locationfound", function (e) {
      setLiveLocation([e.latlng.lat, e.latlng.lng]);
      map.flyTo(e.latlng, 16);
    });
  };

  return (
    <>
      <button 
        onClick={goToLiveLocation}
        className="absolute bottom-6 right-6 z-[1000] bg-white text-slate-800 p-3 rounded-full shadow-xl border border-slate-200 hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center gap-2 font-bold text-sm"
      >
        <LocateFixed size={20} />
        Live Location
      </button>
      {liveLocation && (
        <Marker position={liveLocation}>
          <Popup><strong>Your Live Location</strong></Popup>
        </Marker>
      )}
    </>
  );
}

export default function MapView({ center }: Props) {
  const offset = 0.005;
  const bounds: L.LatLngBoundsExpression = [
    [center[0] - offset, center[1] - offset],
    [center[0] + offset, center[1] + offset]
  ];

  return (
    <div className="w-full h-full relative z-0 bg-slate-900">
      <MapContainer key={`${center[0]}-${center[1]}`} center={center} zoom={15} style={{ height: '100%', width: '100%' }}>
        <MapControls center={center} />
        
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Satellite View">
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Street Map">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Topographic">
            <TileLayer
              attribution='Map data: &copy; <a href="https://www.opentopomap.org">OpenTopoMap</a>'
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        <Marker position={center}>
          <Popup>
            <strong>Image Origin Location</strong><br/>
            Extracted from EXIF metadata.
          </Popup>
        </Marker>
        <Rectangle bounds={bounds} pathOptions={{ color: '#3b82f6', weight: 3, fillOpacity: 0.1, dashArray: '5, 10' }}>
          <Popup>Satellite Image Capture Footprint</Popup>
        </Rectangle>
      </MapContainer>
    </div>
  );
}

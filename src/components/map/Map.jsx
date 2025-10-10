/* eslint-disable react/prop-types */
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";

// Custom Icon
const customMarker = L.icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
  iconAnchor: [17, 34],
  popupAnchor: [0, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
});

const defaultTile = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const satelliteTile =
  "https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}";

// Component that handles user map interaction
function LocationSelector({ editable, onSelect }) {
  const map = useMap();

  useMapEvents({
    click(e) {
      if (!editable) return;
      const { lat, lng } = e.latlng;
      onSelect({ lat, lng });
      map.flyTo([lat, lng], map.getZoom(), { duration: 0.7 });
    },
  });

  return null;
}

function MapInfo({ position }) {
  return (
    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md rounded-lg shadow-md px-3 py-2 text-xs text-gray-700 border border-gray-200">
      <p>
        <span className="font-semibold text-sky-700">Lat:</span>{" "}
        {position.lat.toFixed(5)}
      </p>
      <p>
        <span className="font-semibold text-sky-700">Lng:</span>{" "}
        {position.lng.toFixed(5)}
      </p>
    </div>
  );
}

function ZoomController() {
  const map = useMap();
  return (
    <div className="absolute top-4 right-4 flex flex-col space-y-2">
      <button
        onClick={() => map.zoomIn()}
        className="bg-sky-600 hover:bg-sky-700 text-white rounded-md px-2 py-1 shadow-sm"
      >
        +
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="bg-sky-600 hover:bg-sky-700 text-white rounded-md px-2 py-1 shadow-sm"
      >
        −
      </button>
    </div>
  );
}

function TileSwitcher({ useSatellite, setUseSatellite }) {
  return (
    <div className="absolute top-4 left-4 bg-white rounded-md shadow-lg border border-gray-300 text-xs font-medium">
      <button
        onClick={() => setUseSatellite(false)}
        className={`px-3 py-1 ${
          !useSatellite
            ? "bg-sky-600 text-white"
            : "text-gray-600 hover:bg-gray-100"
        } rounded-l-md`}
      >
        Street
      </button>
      <button
        onClick={() => setUseSatellite(true)}
        className={`px-3 py-1 ${
          useSatellite
            ? "bg-sky-600 text-white"
            : "text-gray-600 hover:bg-gray-100"
        } rounded-r-md`}
      >
        Satellite
      </button>
    </div>
  );
}

const Map = ({
  onLocationSelect,
  defaultCoords = [79.8612, 6.9271],
  isEditable = true,
}) => {
  const [markerPosition, setMarkerPosition] = useState({
    lat: defaultCoords[1],
    lng: defaultCoords[0],
  });
  const [useSatellite, setUseSatellite] = useState(false);

  const handleSelect = useCallback(
    ({ lat, lng }) => {
      setMarkerPosition({ lat, lng });
      onLocationSelect?.({ lat, lng });
    },
    [onLocationSelect]
  );

  const [key, setKey] = useState(0);
  const resetView = () => setKey((k) => k + 1);

  useEffect(() => {
    setMarkerPosition({
      lat: defaultCoords[1],
      lng: defaultCoords[0],
    });
  }, [defaultCoords]);

  return (
    <div className="relative w-full h-[500px] rounded-xl overflow-hidden border border-gray-300 shadow-md">
      <MapContainer
        key={key}
        center={[markerPosition.lat, markerPosition.lng]}
        zoom={13}
        scrollWheelZoom
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          url={
            useSatellite
              ? satelliteTile.replace("{s}", "mt1")
              : defaultTile
          }
          attribution="© OpenStreetMap & Google Maps contributors"
          subdomains={useSatellite ? ["mt0", "mt1", "mt2", "mt3"] : undefined}
        />
        <LocationSelector editable={isEditable} onSelect={handleSelect} />
        <Marker position={[markerPosition.lat, markerPosition.lng]} icon={customMarker}>
          <Popup>
            <div className="text-sm font-medium text-sky-700">
              Selected Location
            </div>
          </Popup>
        </Marker>
        <ZoomController />
      </MapContainer>

      <TileSwitcher
        useSatellite={useSatellite}
        setUseSatellite={setUseSatellite}
      />
      <MapInfo position={markerPosition} />
      <button
        onClick={resetView}
        className="absolute bottom-3 left-3 bg-sky-700 hover:bg-sky-800 text-white px-3 py-2 text-xs rounded-md shadow-md"
      >
        Reset View
      </button>
    </div>
  );
};

export default Map;

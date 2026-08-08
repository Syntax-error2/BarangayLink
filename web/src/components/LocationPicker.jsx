import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker({ position, setPosition }) {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });

    return position === null ? null : (
        <Marker position={position} />
    );
}

export default function LocationPicker({ position, setPosition }) {
    const defaultCenter = [14.5547, 121.0244]; // Makati default
    const [mapCenter, setMapCenter] = useState(defaultCenter);

    const handleUseMyLocation = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                setPosition(newPos);
                setMapCenter([newPos.lat, newPos.lng]);
            }, () => {
                alert('Unable to retrieve your location');
            });
        }
    };

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="flex justify-between items-center">
                <label className="input-label mb-0">Pin Location on Map</label>
                <button 
                    type="button" 
                    onClick={handleUseMyLocation}
                    className="text-xs font-semibold text-primary hover:text-primary-dark"
                >
                    Use My Location
                </button>
            </div>
            <div className="h-48 w-full rounded-xl overflow-hidden border border-border shadow-sm relative z-0">
                <MapContainer center={mapCenter} zoom={14} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; OpenStreetMap'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker position={position} setPosition={setPosition} />
                </MapContainer>
            </div>
            {position && (
                <p className="text-[10px] text-text-muted text-right">
                    Lat: {position.lat.toFixed(6)}, Lng: {position.lng.toFixed(6)}
                </p>
            )}
        </div>
    );
}

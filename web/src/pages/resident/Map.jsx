import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom blue dot for user location
const UserIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(59, 130, 246, 0.5); animation: pulse 2s infinite;"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
});

// Custom green building for Barangay Hall
const HallIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: #10b981; width: 24px; height: 24px; border-radius: 6px; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});

// Custom red cross for Health Center
const HealthIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: #ef4444; width: 24px; height: 24px; border-radius: 12px; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});

// Component to dynamically update map center
function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

export default function GISMap() {
    const { user } = useAuth();
    const [reports, setReports] = useState([]);
    const [userLoc, setUserLoc] = useState(null);
    const [brgyHallLoc, setBrgyHallLoc] = useState(null);
    const [center, setCenter] = useState([14.5547, 121.0244]); // Makati center placeholder
    const [pois, setPois] = useState([]);

    useEffect(() => {
        api.get('/reports').then(res => {
            // Filter out reports without coordinates
            setReports(res.data.filter(r => r.latitude && r.longitude));
        });

        // Resolve Barangay Hall Location using OpenStreetMap Nominatim
        if (user?.barangay) {
            const query = `${user.barangay.name}, ${user.barangay.city}, Philippines`;
            fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json`)
                .then(res => res.json())
                .then(data => {
                    if (data && data.length > 0) {
                        const lat = parseFloat(data[0].lat);
                        const lon = parseFloat(data[0].lon);
                        setBrgyHallLoc([lat, lon]);
                        setCenter([lat, lon]); // Center on Barangay Hall initially
                        
                        // Search for nearby Health Centers / Clinics using Overpass or just Nominatim
                        const healthQuery = `Health Center, ${user.barangay.name}, ${user.barangay.city}`;
                        fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(healthQuery)}&format=json`)
                            .then(r => r.json())
                            .then(hData => {
                                setPois(hData.map(h => ({ name: h.display_name, lat: parseFloat(h.lat), lon: parseFloat(h.lon), type: 'health' })));
                            });
                    }
                });
        }

        // Get user location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const loc = [position.coords.latitude, position.coords.longitude];
                    setUserLoc(loc);
                    // Only center on user if we haven't found the barangay hall yet
                    if (!brgyHallLoc) {
                        setCenter(loc);
                    }
                },
                (error) => console.log('Location error', error),
                { enableHighAccuracy: true }
            );
        }
    }, [user]);

    return (
        <div className="fixed inset-0 bg-background z-0">
            <style>{`
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
                    70% { box-shadow: 0 0 0 15px rgba(59, 130, 246, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
                }
            `}</style>
            <div className="absolute top-16 left-0 w-full z-10 p-4 px-6 bg-white shadow-sm border-b border-border flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-text-primary tracking-tight">Community Map</h2>
                    {brgyHallLoc && <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{user?.barangay?.name} Hall Pinned</p>}
                </div>
                {userLoc && <span className="badge badge-info bg-blue-50 text-blue-600 border-none font-bold text-xs">GPS Active</span>}
            </div>
            <div className="absolute inset-0 z-0 bg-gray-100 pt-[140px] pb-[85px]">
                <MapContainer center={center} zoom={16} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                    <ChangeView center={center} />
                    <TileLayer
                        attribution='&copy; OpenStreetMap'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {/* Barangay Hall Marker */}
                    {brgyHallLoc && (
                        <Marker position={brgyHallLoc} icon={HallIcon}>
                            <Popup>
                                <div className="text-center min-w-[100px]">
                                    <h4 className="font-bold text-emerald-700">Barangay Hall</h4>
                                    <p className="text-xs text-gray-500">{user?.barangay?.name}</p>
                                </div>
                            </Popup>
                        </Marker>
                    )}

                    {/* User Location Marker */}
                    {userLoc && (
                        <Marker position={userLoc} icon={UserIcon}>
                            <Popup>You are here</Popup>
                        </Marker>
                    )}

                    {/* POI Markers (Health Centers) */}
                    {pois.map((poi, idx) => (
                        <Marker key={'poi-'+idx} position={[poi.lat, poi.lon]} icon={HealthIcon}>
                            <Popup>
                                <div className="text-center min-w-[100px]">
                                    <h4 className="font-bold text-red-600">Health Center</h4>
                                    <p className="text-xs text-gray-500">{poi.name.split(',')[0]}</p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                    {/* Report Markers */}
                    {reports.map(report => (
                        <Marker key={report.id} position={[report.latitude, report.longitude]}>
                            <Popup>
                                <div className="p-2 min-w-[120px]">
                                    <h4 className="font-bold text-sm text-text-primary mb-1">{report.title}</h4>
                                    <span className="badge badge-info inline-block mb-1">{report.category?.name}</span>
                                    <p className="text-xs text-text-secondary">{report.address}</p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
}

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { Home, HeartPulse, Baby } from 'lucide-react';
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

const createMarkerIcon = (IconComponent, bgColor, borderRadius = '6px') => {
    const iconHtml = renderToStaticMarkup(<IconComponent size={14} color="white" strokeWidth={2.5} />);
    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${bgColor}; width: 24px; height: 24px; border-radius: ${borderRadius}; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">${iconHtml}</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });
};

const UserIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(59, 130, 246, 0.5); animation: pulse 2s infinite;"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
});

const HallIcon = createMarkerIcon(Home, '#10b981'); // Emerald
const HealthIcon = createMarkerIcon(HeartPulse, '#ef4444', '12px'); // Red circle
const DaycareIcon = createMarkerIcon(Baby, '#f59e0b', '12px'); // Amber circle

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
                        
                        // Search for nearby Health Centers and Daycares sequentially
                        const searchPoi = (poiName, type, icon) => {
                            const pQuery = `${poiName}, ${user.barangay.name}, ${user.barangay.city}`;
                            fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(pQuery)}&format=json`)
                                .then(r => r.json())
                                .then(hData => {
                                    if (hData.length > 0) {
                                        setPois(prev => [...prev, ...hData.map(h => ({ name: h.display_name, lat: parseFloat(h.lat), lon: parseFloat(h.lon), type, icon }))]);
                                    }
                                });
                        };

                        searchPoi('Health Center', 'Health Center', HealthIcon);
                        setTimeout(() => searchPoi('Daycare', 'Daycare Center', DaycareIcon), 1000);
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
            <div className="absolute top-0 left-0 w-full z-10 p-4 px-6 pt-[calc(env(safe-area-inset-top)+16px)] bg-white/90 backdrop-blur-md shadow-sm border-b border-border flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-text-primary tracking-tight">Community Map</h2>
                    {brgyHallLoc && <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{user?.barangay?.name} Hall Pinned</p>}
                </div>
                {userLoc && <span className="badge badge-info bg-blue-50 text-blue-600 border-none font-bold text-xs px-3">GPS Active</span>}
            </div>
            
            <div className="absolute inset-0 z-0 bg-gray-100">
                <MapContainer center={center} zoom={16} style={{ height: '100%', width: '100%' }} zoomControl={false} className="pb-[85px] pt-[calc(env(safe-area-inset-top)+80px)]">
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

                    {/* POI Markers */}
                    {pois.map((poi, idx) => (
                        <Marker key={'poi-'+idx} position={[poi.lat, poi.lon]} icon={poi.icon}>
                            <Popup>
                                <div className="text-center min-w-[100px]">
                                    <h4 className={`font-bold ${poi.type === 'Daycare Center' ? 'text-amber-600' : 'text-red-600'}`}>{poi.type}</h4>
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
